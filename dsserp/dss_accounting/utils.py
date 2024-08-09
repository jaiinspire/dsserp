import frappe

@frappe.whitelist()
def get_account(account):
    ledget_settings =  frappe.get_single("Expense Ledger Settings")
    if ledget_settings.is_active:
        ls =  frappe.db.sql(
            """
                SELECT * from `tabExpense Ledger Item` where account = '{}'
            """.format(account),as_dict=1
        )
        return ls if ls else False