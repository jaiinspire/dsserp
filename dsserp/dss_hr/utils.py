import frappe
from dsserp.dss_accounting.utils import get_account as ledger_settings


@frappe.whitelist()
def get_account(expense_type=None,company=None):
    if not expense_type:
        return False
    
    return ledger_settings(
        frappe.db.get_value(
        "Expense Claim Account",
        {
            "parent":expense_type,
            "company":company
        },
        "default_account"
    )
    )

