frappe.ui.form.on("Expense Claim",{
    refresh: function(frm) {
        frm.fields_dict['expenses'].grid.wrapper.on('change', function(e, grid_row) {
            MakeFieldDisable(frm, cur_frm.grid_row)
        });
    },
    expenses_on_form_rendered(doc) {
        cur_frm.grid_row = doc.open_grid_row();
        MakeFieldDisable(doc, cur_frm.grid_row)
        SetCostCenter(doc, cur_frm.grid_row)
	}
})


frappe.ui.form.on("Expense Claim Detail",{
    expense_type: function(frm, cdt, cdn){
        if(cur_frm.grid_row){
            var row = locals[cdt][cdn]
            ClearField(cur_frm.grid_row)
            MakeFieldDisable(frm, cur_frm.grid_row, row.expense_type)
        }
    }
})

function ClearField(grid_row){
    GetFields().forEach((val)=>{
        grid_row.grid_form.fields_dict[val].set_value(undefined)
    })
}

function MakeFieldDisable(frm, grid_row = null, expense_type=null){
    if(!grid_row){
        return false
    }

    
    var ledger_fields = GetFields()
   
    if(! expense_type){
        var expense_type = cur_frm.grid_row.get_field('expense_type').value
    }
   
    if(expense_type){
        frappe.call({method: "dsserp.dss_hr.utils.get_account",args:{expense_type: expense_type, company: frm.doc.company}}).then((r) =>{
            
           if(r.message){
                ledger_fields.forEach((val)=>{
                    grid_row.grid_form.fields_dict[val].df.hidden = r.message[0][val]? false:true
                    grid_row.grid_form.fields_dict[val].refresh()
                })
           }else{
                ledger_fields.forEach((val)=>{
                    grid_row.grid_form.fields_dict[val].df.hidden =  true
                    grid_row.grid_form.fields_dict[val].refresh()
                }) 
        }
        })
    }else{
        ledger_fields.forEach((val)=>{
            grid_row.grid_form.fields_dict[val].df.hidden =  true
            grid_row.grid_form.fields_dict[val].refresh()
        })
    }
}

function SetCostCenter(frm, grid_row){
    if(!grid_row.get_field('cost_center').value || grid_row.get_field('cost_center').value !== frm.doc.custom_payroll_cost_center){
        grid_row.grid_form.fields_dict.cost_center.set_value(frm.doc.custom_payroll_cost_center)
    }
    
}

function GetFields(){
    return [
        "custom_utr",
        "custom_section",
        "custom_consumer_insurance__no",
        "custom_monthly_bimonthly",
        "custom_due_date",
        "custom_disconnection_dt",
        "custom_reading__start_",
        "custom_reading__end",
        "custom_consumption",
        "custom_meeting_type",
        "custom_participant_count",
        "custom_location",
        "custom_remarks",
        "custom_month", 
        "custom_year",
        "custom_vehcile_no",
        "custom_petrol_diesel",
        "custom_claim_dt_from",
        "custom_claim_dt_to",
    ]
}