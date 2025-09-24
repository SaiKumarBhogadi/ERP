from django.urls import path
from . import views

urlpatterns = [
    path('enquiries/', views.EnquiryListView.as_view(), name='enquiry-list'),
    path('enquiries/<int:pk>/', views.NewEnquiryView.as_view(), name='enquiry-detail'),

    path('quotations/', views.QuotationListView.as_view(), name='quotation_list'),
    path('quotations/<int:pk>/', views.QuotationDetailView.as_view(), name='quotation_detail'),
    path('quotations/<int:pk>/attachments/',views.QuotationAttachmentView.as_view(), name='quotation_attachments'),
    path('quotations/<int:pk>/attachments/<int:attachment_id>/', views.QuotationAttachmentView.as_view(), name='delete_attachment'),
    path('quotations/<int:pk>/comments/', views.QuotationCommentView.as_view(), name='quotation_comments'),
    path('quotations/<int:pk>/history/', views.QuotationHistoryView.as_view(), name='quotation_history'),
    path('quotations/<int:pk>/revisions/', views.QuotationRevisionView.as_view(), name='quotation_revisions'),
    path('quotations/<int:pk>/pdf/', views.QuotationPDFView.as_view(), name='quotation_pdf'),
    path('quotations/<int:pk>/email/', views.QuotationEmailView.as_view(), name='quotation_email'),

# SalesOrder URLs
    path('sales-orders/', views.SalesOrderListView.as_view(), name='sales-order-list'),
    path('sales-orders/<int:pk>/', views.SalesOrderDetailView.as_view(), name='sales-order-detail'),
    path('sales-orders/<int:pk>/comments/', views.SalesOrderCommentView.as_view(), name='sales-order-comments'),
    path('sales-orders/<int:pk>/history/', views.SalesOrderHistoryView.as_view(), name='sales-order-history'),
    path('sales-orders/<int:pk>/pdf/', views.SalesOrderPDFView.as_view(), name='sales-order-pdf'),
    path('sales-orders/<int:pk>/email/', views.SalesOrderEmailView.as_view(), name='sales-order-email'),
    # DeliveryNote URLs
    path('delivery-notes/', views.DeliveryNoteListView.as_view(), name='delivery-note-list'),
    path('delivery-notes/<int:pk>/', views.DeliveryNoteDetailView.as_view(), name='delivery-note-detail'),
    path('delivery-notes/<int:pk>/items/', views.DeliveryNoteItemView.as_view(), name='delivery-note-items'),
    path('delivery-notes/<int:pk>/items/<int:item_pk>/serial-numbers/', views.DeliveryNoteSerialNumbersView.as_view(), name='delivery-note-serial-numbers'),
    path('delivery-notes/<int:pk>/pdf/', views.DeliveryNotePDFView.as_view(), name='delivery-note-pdf'),
    path('delivery-notes/<int:pk>/email/', views.DeliveryNoteEmailView.as_view(), name='delivery-note-email'),
    # Invoice URLs
    path('invoices/', views.InvoiceListView.as_view(), name='invoice-list'),
    path('invoices/<int:pk>/', views.InvoiceDetailView.as_view(), name='invoice-detail'),
    path('invoices/<int:pk>/items/', views.InvoiceItemView.as_view(), name='invoice-items'),
    path('invoices/<int:pk>/pdf/', views.InvoicePDFView.as_view(), name='invoice-pdf'),
    path('invoices/<int:pk>/email/', views.InvoiceEmailView.as_view(), name='invoice-email'),
]