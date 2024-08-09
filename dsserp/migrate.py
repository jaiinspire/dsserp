from frappe.custom.doctype.property_setter.property_setter import make_property_setter

def after_migrate():
    make_custom_property_setters()

def make_custom_property_setters():
    make_property_setter("Expense Claim", "cost_center", "fetch_from", "employee.payroll_cost_center", "Text")
    make_property_setter("Expense Claim", "cost_center", "fetch_if_empty", 1, "Check")