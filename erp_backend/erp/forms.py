from django import forms
from .models import Customer

class CustomerImportForm(forms.Form):
    file = forms.FileField()

    def clean_file(self):
        file = self.cleaned_data['file']
        if not file.name.endswith(('.csv', '.xlsx', '.xls')):
            raise forms.ValidationError("Only CSV and Excel files are supported.")
        return file