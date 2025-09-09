from django.db import models
from django.contrib.auth.models import User

class Enquiry(models.Model):
    enquiry_id = models.CharField(max_length=10, unique=True)  # e.g., ENQ001
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # Link to core User
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    street_address = models.CharField(max_length=200, blank=True)
    apartment = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    enquiry_type = models.CharField(max_length=50, choices=[('Product', 'Product'), ('Service', 'Service')])
    enquiry_description = models.TextField(blank=True)
    enquiry_channels = models.CharField(max_length=50, blank=True, choices=[
        ('Phone', 'Phone'), ('Email', 'Email'), ('Web Form', 'Web Form'),
        ('Facebook', 'Facebook'), ('Twitter', 'Twitter'), ('Instagram', 'Instagram'), ('LinkedIn', 'LinkedIn')
    ])
    source = models.CharField(max_length=50, choices=[
        ('WebSite', 'WebSite'), ('Referral', 'Referral'), ('Online Advertising', 'Online Advertising'),
        ('Offline Advertising', 'Offline Advertising'), ('Facebook', 'Facebook'), ('Twitter', 'Twitter'),
        ('Instagram', 'Instagram'), ('LinkedIn', 'LinkedIn')
    ])
    how_heard_this = models.CharField(max_length=50, blank=True, choices=[
        ('WebSite', 'WebSite'), ('Referral', 'Referral'), ('Social Media', 'Social Media'),
        ('Event', 'Event'), ('Search Engine', 'Search Engine'), ('Other', 'Other')
    ])
    urgency_level = models.CharField(max_length=50, blank=True, choices=[
        ('Immediately', 'Immediately'), ('Within 1-3 Months', 'Within 1-3 Months'),
        ('Within 6 Months', 'Within 6 Months'), ('Just Researching', 'Just Researching')
    ])
    enquiry_status = models.CharField(max_length=20, choices=[
        ('New', 'New'), ('In Process', 'In Process'), ('Closed', 'Closed')
    ])
    priority = models.CharField(max_length=20, blank=True, choices=[
        ('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.enquiry_id} - {self.first_name} {self.last_name}"

class EnquiryItem(models.Model):
    enquiry = models.ForeignKey(Enquiry, on_delete=models.CASCADE, related_name='items')
    item_code = models.CharField(max_length=10)
    product_description = models.CharField(max_length=200)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.item_code} - {self.product_description}"
    

from django.db import models
from django.contrib.auth import get_user_model
from core.models import Branch, Department, Role
from core.models import Product, UOM,Customer


User = get_user_model()

class Quotation(models.Model):
    quotation_id = models.CharField(max_length=10, unique=True)  # e.g., QUO001
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    customer_name = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='quotations')
    customer_po_referance = models.CharField(max_length=100, blank=True, null=True)
    sales_rep = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'role': 'Sales Representative'}, related_name='quotations')
    quotation_type = models.CharField(max_length=50, choices=[('Standard', 'Standard'), ('Blanket', 'Blanket'), ('Service', 'Service')])
    quotation_date = models.DateField()
    expiry_date = models.DateField()
    currency = models.CharField(max_length=3, choices=[('USD', 'USD'), ('INR', 'INR'), ('EUR', 'EUR'), ('GBP', 'GBP'), ('SGD', 'SGD')])
    payment_terms = models.CharField(max_length=50, blank=True, choices=[('Net 15', 'Net 15'), ('Net 30', 'Net 30'), ('Net 45', 'Net 45'), ('Net 60', 'Net 60'), ('Advance', 'Advance'), ('COD', 'COD')])
    expected_delivery = models.DateField()
    status = models.CharField(max_length=20, choices=[('Draft', 'Draft'), ('Send', 'Send'), ('Approved', 'Approved'), ('Rejected', 'Rejected'), ('Converted (SO)', 'Converted (SO)'), ('Expired', 'Expired')])
    revise_count = models.PositiveIntegerField(default=1)
    globalDiscount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    shippingCharges = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quotation_id} - {self.customer_name}"

class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='items')
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='quotation_items')
    product_name = models.CharField(max_length=200, editable=False)  # Populated from Product.name
    uom = models.ForeignKey(UOM, on_delete=models.CASCADE, related_name='quotation_items')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=5, decimal_places=2)
    quantity = models.PositiveIntegerField()
    total = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.product_name = self.product_id.name  # Auto-populate product name
        self.total = self.unit_price * self.quantity * (1 - self.discount / 100) * (1 + self.tax / 100)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product_id} - {self.product_name}"

class QuotationAttachment(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='attachments/', blank=True, null=True)  # Replaced URL with FileField
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='uploaded_attachments')

class QuotationComment(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='comments')
    person_name = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='comments')
    comment = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.person_name} - {self.comment[:20]}"

class QuotationHistory(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='history')
    status = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    action_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='history_actions')

    def __str__(self):
        return f"{self.status} by {self.action_by}"

class QuotationRevision(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='revisions')
    revision_number = models.PositiveIntegerField()
    date = models.DateField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='revisions')
    status = models.CharField(max_length=20, default='Draft')
    comment = models.TextField(blank=True)
    revise_history = models.JSONField(default=dict)

    def __str__(self):
        return f"Rev {self.revision_number} - {self.quotation.quotation_id}"
    

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from core.models import Customer, Product, Role, UOM, TaxCode

User = get_user_model()

class SalesOrder(models.Model):
    SALES_STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Submitted(PD)', 'Submitted(PD)'),
        ('Cancelled', 'Cancelled'),
    ]
    sales_order_id = models.CharField(max_length=50, unique=True, editable=False)
    order_date = models.DateField(default=timezone.now)
    sales_rep = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'Sales Representative'})
    order_type = models.CharField(max_length=50, choices=[('Standard', 'Standard'), ('Rush', 'Rush'), ('Backorder', 'Backorder')])
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50, blank=True)
    currency = models.CharField(max_length=10, choices=[('IND', 'IND'), ('USD', 'USD'), ('EUR', 'EUR'), ('GBP', 'GBP'), ('SGD', 'SGD')])
    due_date = models.DateField(blank=True, null=True)
    terms_conditions = models.TextField(blank=True)
    shipping_method = models.CharField(max_length=50, blank=True)
    expected_delivery = models.DateField(blank=True, null=True)
    tracking_number = models.CharField(max_length=50, blank=True)
    internal_notes = models.TextField(blank=True)
    customer_notes = models.TextField(blank=True)
    global_discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    shipping_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=SALES_STATUS_CHOICES, default='Draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.sales_order_id:
            last_order = SalesOrder.objects.order_by('id').last()
            if last_order:
                last_num = int(last_order.sales_order_id.replace('SO', ''))
                new_num = last_num + 1
            else:
                new_num = 1
            self.sales_order_id = f'SO{new_num:04d}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Sales Order {self.sales_order_id}"

class SalesOrderItem(models.Model):
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True)
    tax = models.ForeignKey(TaxCode, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(default=0)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        subtotal = self.quantity * self.unit_price
        tax_amount = (subtotal * self.tax.percentage) / 100 if self.tax else 0
        taxed_amount = subtotal + tax_amount
        discount_amount = (taxed_amount * self.discount) / 100
        self.total = taxed_amount - discount_amount
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.sales_order.sales_order_id}"

class SalesOrderComment(models.Model):
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):  
        return f"Comment by {self.user.username} on {self.sales_order.sales_order_id}"

class SalesOrderHistory(models.Model):
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='history')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.action} by {self.user.username} on {self.sales_order.sales_order_id}"