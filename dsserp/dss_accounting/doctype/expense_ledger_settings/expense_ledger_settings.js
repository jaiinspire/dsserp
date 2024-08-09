// Copyright (c) 2024, alex and contributors
// For license information, please see license.txt

frappe.ui.form.on("Expense Ledger Settings", {
	is_active(frm) {
        if(frm.doc.is_active){
            frm.set_value("status","Active")
        }else{
            frm.set_value("status","Inactive")
        }
        
	},
});
