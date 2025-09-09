from rest_framework import serializers
from .models import Enquiry, EnquiryItem

class EnquiryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnquiryItem
        fields = ['id', 'item_code', 'product_description', 'cost_price', 'selling_price', 'quantity', 'total_amount']

class EnquirySerializer(serializers.ModelSerializer):
    items = EnquiryItemSerializer(many=True, read_only=True)
    grand_total = serializers.SerializerMethodField()

    class Meta:
        model = Enquiry
        fields = [
            'id', 'enquiry_id', 'first_name', 'last_name', 'email', 'phone_number',
            'street_address', 'apartment', 'city', 'state', 'postal', 'country',
            'enquiry_type', 'enquiry_description', 'enquiry_channels', 'source',
            'how_heard_this', 'urgency_level', 'enquiry_status', 'priority',
            'created_at', 'items', 'grand_total'
        ]

    def get_grand_total(self, obj):
        return sum(item.total_amount for item in obj.items.all()) if obj.items.exists() else 0

class EnquiryCreateSerializer(serializers.ModelSerializer):
    items = EnquiryItemSerializer(many=True, required=False)

    class Meta:
        model = Enquiry
        fields = [
            'first_name', 'last_name', 'email', 'phone_number', 'street_address',
            'apartment', 'city', 'state', 'postal', 'country', 'enquiry_type',
            'enquiry_description', 'enquiry_channels', 'source', 'how_heard_this',
            'urgency_level', 'enquiry_status', 'priority', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        enquiry = Enquiry.objects.create(enquiry_id=self._generate_enquiry_id(), **validated_data)
        for item_data in items_data:
            EnquiryItem.objects.create(enquiry=enquiry, **item_data)
        return enquiry

    def _generate_enquiry_id(self):
        last_enquiry = Enquiry.objects.order_by('-id').first()
        if last_enquiry:
            last_id = int(last_enquiry.enquiry_id.replace('ENQ', '')) + 1
        else:
            last_id = 1
        return f'ENQ{last_id:03d}'  # e.g., ENQ001, ENQ002
    

from rest_framework import serializers
from .models import Quotation, QuotationItem, QuotationAttachment, QuotationComment, QuotationHistory, QuotationRevision
from core.models import Customer, Role
from core.models import Product, UOM
from django.contrib.auth import get_user_model

User = get_user_model()

class QuotationItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    uom = serializers.PrimaryKeyRelatedField(queryset=UOM.objects.all())
    product_name = serializers.CharField(source='product_id.name', read_only=True)

    class Meta:
        model = QuotationItem
        fields = ['id', 'product_id', 'product_name', 'uom', 'unit_price', 'discount', 'tax', 'quantity', 'total']

class QuotationAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), default=serializers.CurrentUserDefault())
    file = serializers.FileField()

    class Meta:
        model = QuotationAttachment
        fields = ['id', 'file', 'uploaded_by', 'timestamp']

class QuotationCommentSerializer(serializers.ModelSerializer):
    person_name = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), default=serializers.CurrentUserDefault())

    class Meta:
        model = QuotationComment
        fields = ['id', 'person_name', 'comment', 'timestamp']

class QuotationHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), default=serializers.CurrentUserDefault())

    class Meta:
        model = QuotationHistory
        fields = ['id', 'status', 'timestamp', 'action_by']

class QuotationRevisionSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), default=serializers.CurrentUserDefault())

    class Meta:
        model = QuotationRevision
        fields = ['id', 'revision_number', 'date', 'created_by', 'status', 'comment', 'revise_history']

class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)
    attachments = QuotationAttachmentSerializer(many=True, read_only=True)
    comments = QuotationCommentSerializer(many=True, read_only=True)
    history = QuotationHistorySerializer(many=True, read_only=True)
    revisions = QuotationRevisionSerializer(many=True, read_only=True)
    customer_name = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    sales_rep = serializers.PrimaryKeyRelatedField(queryset=Role.objects.filter(role='Sales Representative'), allow_null=True)
    grand_total = serializers.SerializerMethodField()

    class Meta:
        model = Quotation
        fields = [
            'id', 'quotation_id', 'quotation_type', 'quotation_date', 'expiry_date', 'customer_name',
            'customer_po_referance', 'sales_rep', 'currency', 'payment_terms', 'expected_delivery',
            'status', 'revise_count', 'globalDiscount', 'shippingCharges', 'created_at', 'items',
            'attachments', 'comments', 'history', 'revisions', 'grand_total'
        ]

    def get_grand_total(self, obj):
        subtotal = sum(item.total for item in obj.items.all())
        discount_amount = subtotal * (obj.globalDiscount / 100)
        return round(subtotal - discount_amount + obj.shippingCharges, 2)

class QuotationCreateSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, required=False)
    attachments = QuotationAttachmentSerializer(many=True, required=False)
    comments = QuotationCommentSerializer(many=True, required=False)
    history = QuotationHistorySerializer(many=True, required=False)
    revisions = QuotationRevisionSerializer(many=True, required=False)
    customer_name = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    sales_rep = serializers.PrimaryKeyRelatedField(queryset=Role.objects.filter(role='Sales Representative'), allow_null=True)

    class Meta:
        model = Quotation
        fields = [
            'quotation_type', 'quotation_date', 'expiry_date', 'customer_name', 'customer_po_referance',
            'sales_rep', 'currency', 'payment_terms', 'expected_delivery', 'status', 'revise_count',
            'globalDiscount', 'shippingCharges', 'items', 'attachments', 'comments', 'history', 'revisions'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        attachments_data = validated_data.pop('attachments', [])
        comments_data = validated_data.pop('comments', [])
        history_data = validated_data.pop('history', [])
        revisions_data = validated_data.pop('revisions', [])
        quotation = Quotation.objects.create(quotation_id=self._generate_quotation_id(), user=self.context['request'].user, **validated_data)
        for item_data in items_data:
            QuotationItem.objects.create(quotation=quotation, **item_data)
        for attachment_data in attachments_data:
            QuotationAttachment.objects.create(quotation=quotation, **attachment_data)
        for comment_data in comments_data:
            QuotationComment.objects.create(quotation=quotation, **comment_data)
        for history_data in history_data:
            QuotationHistory.objects.create(quotation=quotation, **history_data)
        for revision_data in revisions_data:
            QuotationRevision.objects.create(quotation=quotation, **revision_data)
        return quotation

    def _generate_quotation_id(self):
        last_quotation = Quotation.objects.order_by('-id').first()
        if last_quotation:
            last_id = int(last_quotation.quotation_id.replace('QUO', '')) + 1
        else:
            last_id = 1
        return f'QUO{last_id:03d}'
    

from rest_framework import serializers
from .models import SalesOrder, SalesOrderItem, SalesOrderComment, SalesOrderHistory
from core.serializers import CustomerSerializer, ProductSerializer, UOMSerializer, TaxCodeSerializer

class SalesOrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    uom = UOMSerializer()
    tax = TaxCodeSerializer()

    class Meta:
        model = SalesOrderItem
        fields = ['id', 'product', 'uom', 'tax', 'quantity', 'unit_price', 'discount', 'total']

class SalesOrderCreateSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    sales_rep = serializers.PrimaryKeyRelatedField(queryset=Role.objects.filter(role ='Sales Representative'), allow_null=True)

    class Meta:
        model = SalesOrder
        fields = ['id', 'order_date', 'sales_rep', 'order_type', 'customer', 'payment_method', 'currency', 'due_date', 'terms_conditions', 'shipping_method', 'expected_delivery', 'tracking_number', 'internal_notes', 'customer_notes', 'global_discount', 'shipping_charges', 'status']

class SalesOrderSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()
    sales_rep = serializers.CharField(source='sales_rep.role')
    items = SalesOrderItemSerializer(many=True, required=False)
    comments = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()

    class Meta:
        model = SalesOrder
        fields = ['id', 'sales_order_id', 'order_date', 'sales_rep', 'order_type', 'customer', 'payment_method', 'currency', 'due_date', 'terms_conditions', 'shipping_method', 'expected_delivery', 'tracking_number', 'internal_notes', 'customer_notes', 'global_discount', 'shipping_charges', 'status', 'items', 'comments', 'history']

    def get_comments(self, obj):
        return SalesOrderCommentSerializer(obj.comments.all(), many=True).data

    def get_history(self, obj):
        return SalesOrderHistorySerializer(obj.history.all(), many=True).data

class SalesOrderCommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username')

    class Meta:
        model = SalesOrderComment
        fields = ['id', 'user', 'comment', 'timestamp']

class SalesOrderHistorySerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username')

    class Meta:
        model = SalesOrderHistory
        fields = ['id', 'user', 'action', 'timestamp']