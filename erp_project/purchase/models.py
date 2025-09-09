from django.db import models
from django.utils import timezone
from core.models import Supplier, Product

def get_default_po_date():
    return timezone.now().date()

class PurchaseOrder(models.Model):
    PO_ID = models.CharField(max_length=20, unique=True, editable=False)
    PO_date = models.DateField(default=get_default_po_date)
    delivery_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=[('Draft', 'Draft'), ('Submitted', 'Submitted'), ('Partially Received', 'Partially Received'), 
                ('Closed', 'Closed'), ('Canceled', 'Canceled')],
        default='Draft'
    )
    sales_order_reference = models.CharField(max_length=100)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    supplier_name = models.CharField(max_length=100)
    payment_terms = models.CharField(max_length=50)
    inco_terms = models.CharField(max_length=50)
    currency = models.CharField(max_length=10)
    notes_comments = models.TextField(blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    global_discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    tax_summary = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_charges = models.DecimalField(max_digits=10, decimal_places=2)
    rounding_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_order_value = models.DecimalField(max_digits=10, decimal_places=2)
    upload_file_path = models.FileField(upload_to='upload/', blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.PO_ID:
            last_po = PurchaseOrder.objects.order_by('-id').first()
            new_id = f'PO-{timezone.now().strftime("%Y%m%d")}-{str(last_po.id + 1).zfill(3) if last_po else "001"}'
            self.PO_ID = new_id
        super().save(*args, **kwargs)

class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    qty_ordered = models.IntegerField()
    insufficient_stock = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.total = self.qty_ordered * self.unit_price * (1 - self.discount/100) * (1 + self.tax/100)
        super().save(*args, **kwargs)

class PurchaseOrderHistory(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='history')
    action = models.CharField(max_length=100)
    performed_by = models.CharField(max_length=100)
    timestamp = models.DateTimeField(default=timezone.now)
    details = models.TextField(blank=True)

class PurchaseOrderComment(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField(null=True, blank=True)
    created_by = models.CharField(max_length=100)
    timestamp = models.DateTimeField(default=timezone.now)


from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from core.models import Supplier, Product, Warehouse, Department

def get_default_grn_date():
    return timezone.now().date()

class StockReceiptAttachment(models.Model):
    stock_receipt = models.ForeignKey('StockReceipt', on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='stock_receipt_attachments/')

class StockReceiptRemark(models.Model):
    stock_receipt = models.ForeignKey('StockReceipt', on_delete=models.CASCADE, related_name='remarks')
    text = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

class StockReceipt(models.Model):
    GRN_ID = models.CharField(max_length=20, unique=True, editable=False)
    PO_reference = models.ForeignKey('purchase.PurchaseOrder', on_delete=models.SET_NULL, null=True, blank=True)
    received_date = models.DateField(default=get_default_grn_date)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    supplier_dn_no = models.CharField(max_length=100, blank=True)
    supplier_invoice_no = models.CharField(max_length=100, blank=True)
    received_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='received_receipts', limit_choices_to={'department__department_name': 'Sales'})
    qc_done_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='qc_receipts', limit_choices_to={'department__department_name': 'Sales'})
    status = models.CharField(
        max_length=20,
        choices=[('Draft', 'Draft'), ('Submitted', 'Submitted'), ('Returned', 'Returned'), ('Cancelled', 'Cancelled')],
        default='Draft'
    )

    def save(self, *args, **kwargs):
        if not self.GRN_ID:
            last_grn = StockReceipt.objects.order_by('-id').first()
            new_id = f'GRN-{timezone.now().strftime("%Y%m%d")}-{str(last_grn.id + 1).zfill(4) if last_grn else "0001"}'
            self.GRN_ID = new_id
        super().save(*args, **kwargs)

class StockReceiptItem(models.Model):
    stock_receipt = models.ForeignKey(StockReceipt, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_id = models.CharField(max_length=50, blank=True)  # Auto-filled from Product via frontend
    uom = models.CharField(max_length=50, blank=True)  # Auto-filled from Product via frontend
    qty_ordered = models.IntegerField(blank=True, null=True)  # Auto-filled from PO via frontend
    qty_received = models.IntegerField()  # Input by user
    accepted_qty = models.IntegerField()  # Input by user
    rejected_qty = models.IntegerField(default=0)
    qty_returned = models.IntegerField(default=0)
    stock_dim = models.CharField(max_length=20, choices=[('None', 'None'), ('Serial', 'Serial'), ('Batch', 'Batch')], default='None')
    warehouse = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.rejected_qty:
            self.rejected_qty = self.qty_received - self.accepted_qty
        if self.rejected_qty < 0:
            self.rejected_qty = 0
        super().save(*args, **kwargs)

class SerialNumber(models.Model):
    stock_receipt_item = models.ForeignKey(StockReceiptItem, on_delete=models.CASCADE, related_name='serial_numbers')
    serial_no = models.CharField(max_length=50, unique=True)

class BatchNumber(models.Model):
    stock_receipt_item = models.ForeignKey(StockReceiptItem, on_delete=models.CASCADE, related_name='batch_numbers')
    batch_no = models.CharField(max_length=50, unique=True)
    batch_qty = models.IntegerField()
    mfg_date = models.DateField()
    expiry_date = models.DateField()

class BatchSerialNumber(models.Model):
    batch_number = models.ForeignKey(BatchNumber, on_delete=models.CASCADE, related_name='serial_numbers')
    serial_no = models.CharField(max_length=50, unique=True)