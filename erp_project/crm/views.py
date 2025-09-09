from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Enquiry, EnquiryItem
from .serializers import EnquirySerializer, EnquiryCreateSerializer
from django.core.exceptions import ObjectDoesNotExist

class EnquiryListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        enquiries = Enquiry.objects.filter(user=request.user).order_by('-created_at')
        serializer = EnquirySerializer(enquiries, many=True)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            enquiry = Enquiry.objects.get(id=pk, user=request.user)
            enquiry.delete()
            return Response({'message': 'Enquiry deleted successfully'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'Enquiry not found'}, status=status.HTTP_404_NOT_FOUND)

class NewEnquiryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            try:
                enquiry = Enquiry.objects.get(id=pk, user=request.user)
                serializer = EnquirySerializer(enquiry)
                return Response(serializer.data)
            except ObjectDoesNotExist:
                return Response({'error': 'Enquiry not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Use POST to create a new enquiry'})

    def post(self, request):
        serializer = EnquiryCreateSerializer(data=request.data)
        if serializer.is_valid():
            enquiry = serializer.save(user=request.user)
            return Response(EnquirySerializer(enquiry).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            enquiry = Enquiry.objects.get(id=pk, user=request.user)
            serializer = EnquiryCreateSerializer(enquiry, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(EnquirySerializer(enquiry).data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response({'error': 'Enquiry not found'}, status=status.HTTP_404_NOT_FOUND)
        


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Quotation, QuotationItem, QuotationAttachment, QuotationComment, QuotationHistory, QuotationRevision
from .serializers import QuotationSerializer, QuotationCreateSerializer, QuotationAttachmentSerializer, QuotationCommentSerializer, QuotationHistorySerializer, QuotationItemSerializer, QuotationRevisionSerializer
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
import io

class QuotationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        quotations = Quotation.objects.filter(user=request.user).order_by('-created_at')
        serializer = QuotationSerializer(quotations, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = QuotationCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            quotation = serializer.save()
            return Response(QuotationSerializer(quotation).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            quotation.delete()
            return Response({'message': 'Quotation deleted successfully'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)

class QuotationDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            serializer = QuotationSerializer(quotation)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            action = request.data.get('action')
            if action == 'save_draft':
                quotation.status = 'Draft'
            elif action == 'submit':
                quotation.status = 'Send'
            elif action == 'approve':
                quotation.status = 'Approved'
            elif action == 'reject':
                quotation.status = 'Rejected'
            elif action == 'convert_to_so':
                quotation.status = 'Converted (SO)'
            elif action == 'cancel':
                quotation.status = 'Expired'  # Or handle cancellation differently if needed
            else:
                serializer = QuotationCreateSerializer(quotation, data=request.data, partial=True, context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    return Response(QuotationSerializer(quotation).data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            quotation.save()
            QuotationHistory.objects.create(quotation=quotation, status=quotation.status, action_by=request.user)
            return Response(QuotationSerializer(quotation).data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)
        

class QuotationAttachmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            attachment_data = {
                'file': request.FILES.get('file'),
                'uploaded_by': request.user,
            }
            attachment = QuotationAttachment.objects.create(quotation=quotation, **attachment_data)
            serializer = QuotationAttachmentSerializer(attachment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            attachments = quotation.attachments.all()
            serializer = QuotationAttachmentSerializer(attachments, many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk, attachment_id):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            attachment = QuotationAttachment.objects.get(id=attachment_id, quotation=quotation)
            attachment.delete()
            return Response({'message': 'Attachment deleted'}, status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist:
            return Response({'error': 'Attachment or Quotation not found'}, status=status.HTTP_404_NOT_FOUND)

class QuotationCommentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            comment_data = {
                'person_name': request.user,
                'comment': request.data.get('comment'),
            }
            comment = QuotationComment.objects.create(quotation=quotation, **comment_data)
            serializer = QuotationCommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            comments = quotation.comments.all()
            serializer = QuotationCommentSerializer(comments, many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)

class QuotationHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            history = quotation.history.all()
            serializer = QuotationHistorySerializer(history, many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            history_data = {
                'status': request.data.get('status'),
                'action_by': request.user,
            }
            history = QuotationHistory.objects.create(quotation=quotation, **history_data)
            serializer = QuotationHistorySerializer(history)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)

class QuotationRevisionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            revision_data = {
                'revision_number': quotation.revise_count,
                'date': request.data.get('date'),
                'created_by': request.user,
                'status': request.data.get('status', 'Draft'),
                'comment': request.data.get('comment', ''),
                'revise_history': request.data.get('revise_history', {}),
            }
            revision = QuotationRevision.objects.create(quotation=quotation, **revision_data)
            quotation.revise_count += 1
            quotation.save()
            serializer = QuotationRevisionSerializer(revision)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            revisions = quotation.revisions.all()
            serializer = QuotationRevisionSerializer(revisions, many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)


from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Quotation
from .serializers import QuotationSerializer
from django.core.exceptions import ObjectDoesNotExist

class QuotationPDFView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk, user=request.user)
            serializer = QuotationSerializer(quotation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'PDF data fetch failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class QuotationEmailView(APIView):
      permission_classes = [permissions.IsAuthenticated]

      def post(self, request, pk):
          try:
              quotation = Quotation.objects.get(id=pk, user=request.user)
              email = request.data.get('email')
              html_content = request.data.get('html_content', """
                  <html>
                      <body>
                          <h2>Quotation Details</h2>
                          <p><strong>Quotation ID:</strong> {quotation.quotation_id}</p>
                          <p><strong>Customer:</strong> {quotation.customer_name}</p>
                          <p><strong>Date:</strong> {quotation.quotation_date}</p>
                          <p><strong>Total:</strong> ${grand_total}</p>
                          <p>Thank you for your business!</p>
                      </body>
                  </html>
                  """.format(quotation=quotation, grand_total=QuotationSerializer(quotation).data.get('grand_total', 0)))

              if not email:
                  return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

              subject = f'Quotation {quotation.quotation_id}'
              msg = EmailMessage(subject, html_content, to=[email])
              msg.content_subtype = 'html'
              msg.send()
              return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
          except ObjectDoesNotExist:
              return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)
          except Exception as e:
              return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
          



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import SalesOrder, SalesOrderItem, SalesOrderComment, SalesOrderHistory
from .serializers import SalesOrderSerializer, SalesOrderCreateSerializer, SalesOrderCommentSerializer, SalesOrderHistorySerializer
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
import io

class SalesOrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sales_orders = SalesOrder.objects.filter(sales_rep__in=[request.user.profile.role]).order_by('-created_at')
        serializer = SalesOrderSerializer(sales_orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SalesOrderCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            sales_order = serializer.save()
            return Response(SalesOrderSerializer(sales_order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            sales_order = SalesOrder.objects.get(id=pk, sales_rep__in=[request.user.profile.role])
            sales_order.delete()
            return Response({'message': 'Sales Order deleted successfully'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'Sales Order not found'}, status=status.HTTP_404_NOT_FOUND)

class SalesOrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            sales_order = SalesOrder.objects.get(id=pk, sales_rep__in=[request.user.profile.role])
            serializer = SalesOrderSerializer(sales_order)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response({'error': 'Sales Order not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            sales_order = SalesOrder.objects.get(id=pk, sales_rep__in=[request.user.profile.role])
            action = request.data.get('action')
            if action == 'save_draft':
                sales_order.status = 'Draft'
            elif action == 'submit':
                sales_order.status = 'Submitted'
            elif action == 'submit_pd':
                sales_order.status = 'Submitted(PD)'
            elif action == 'cancel':
                sales_order.status = 'Cancelled'
            else:
                serializer = SalesOrderCreateSerializer(sales_order, data=request.data, partial=True, context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    return Response(SalesOrderSerializer(sales_order).data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            sales_order.save()
            SalesOrderHistory.objects.create(sales_order=sales_order, action=action, user=request.user)
            return Response(SalesOrderSerializer(sales_order).data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'Sales Order not found'}, status=status.HTTP_404_NOT_FOUND)

class SalesOrderCommentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            sales_order = SalesOrder.objects.get(id=pk, sales_rep__in=[request.user.profile.role])
            comment_data = {
                'user': request.user,
                'comment': request.data.get('comment'),
            }
            comment = SalesOrderComment.objects.create(sales_order=sales_order, **comment_data)
            serializer = SalesOrderCommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response({'error': 'Sales Order not found'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        try:
            sales_order = SalesOrder.objects.get(id=pk, sales_rep__in=[request.user.profile.role])
            comments = sales_order.comments.all()
            serializer = SalesOrderCommentSerializer(comments, many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response({'error': 'Sales Order not found'}, status=status.HTTP_404_NOT_FOUND)

class SalesOrderHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            sales_order = SalesOrder.objects.get(id=pk, sales_rep__in=[request.user.profile.role])
            history = sales_order.history.all()
            serializer = SalesOrderHistorySerializer(history, many=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response({'error': 'Sales Order not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk):
        try:
            sales_order = SalesOrder.objects.get(id=pk, sales_rep__in=[request.user.profile.role])
            history_data = {
                'user': request.user,
                'action': request.data.get('action'),
            }
            history = SalesOrderHistory.objects.create(sales_order=sales_order, **history_data)
            serializer = SalesOrderHistorySerializer(history)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response({'error': 'Sales Order not found'}, status=status.HTTP_404_NOT_FOUND)

class SalesOrderPDFView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            sales_order = SalesOrder.objects.get(id=pk, sales_rep__in=[request.user.profile.role])
            serializer = SalesOrderSerializer(sales_order)
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            elements = []

            data = [
                ['Sales Order ID', sales_order.sales_order_id],
                ['Order Date', sales_order.order_date.strftime('%Y-%m-%d')],
                ['Customer', f"{sales_order.customer.first_name} {sales_order.customer.last_name}"],
                ['Total', f"{sales_order.currency} {sum(item.total for item in sales_order.items.all())}"],
            ]
            table = Table(data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 14),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 12),
            ]))
            elements.append(table)
            elements.append(Spacer(1, 12))

            doc.build(elements)
            buffer.seek(0)
            return HttpResponse(buffer, content_type='application/pdf')
        except ObjectDoesNotExist:
            return Response({'error': 'Sales Order not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'PDF generation failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SalesOrderEmailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            sales_order = SalesOrder.objects.get(id=pk, sales_rep__in=[request.user.profile.role])
            email = request.data.get('email')
            html_content = request.data.get('html_content', """
                <html>
                    <body>
                        <h2>Sales Order Details</h2>
                        <p><strong>Sales Order ID:</strong> {sales_order.sales_order_id}</p>
                        <p><strong>Customer:</strong> {sales_order.customer.first_name} {sales_order.customer.last_name}</p>
                        <p><strong>Date:</strong> {sales_order.order_date}</p>
                        <p><strong>Total:</strong> {sales_order.currency} {sum(item.total for item in sales_order.items.all())}</p>
                        <p>Thank you for your business!</p>
                    </body>
                </html>
            """.format(sales_order=sales_order))

            if not email:
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

            subject = f'Sales Order {sales_order.sales_order_id}'
            msg = EmailMessage(subject, html_content, to=[email])
            msg.content_subtype = 'html'
            msg.send()
            return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'Sales Order not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)