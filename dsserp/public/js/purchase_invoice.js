frappe.ui.form.on("Purchase Invoice",{
    items_on_form_rendered(doc) {
        cur_frm.grid_row = doc.open_grid_row();
        MakeFieldDisable(doc, cur_frm.grid_row)
	},
    refresh: function(frm) {
        frm.fields_dict['items'].grid.wrapper.on('change', function(e, grid_row) {
            MakeFieldDisable(frm,cur_frm.grid_row)
        });
    }
})


frappe.ui.form.on("Purchase Invoice Item",{
    item_code: function(frm, cdt, cdn){
        if(cur_frm.grid_row){
            const delay = ms => new Promise(res => setTimeout(res, ms));
            const debound = async () => {
                await delay(2000);
                var row = locals[cdt][cdn]
                MakeFieldDisable(frm, cur_frm.grid_row, row.expense_account)
              };
            debound()
        }
    },
    expense_account: function(frm, cdt,cdn){
        var row = locals[cdt][cdn]
        ClearField(cur_frm.grid_row)
        MakeFieldDisable(frm, cur_frm.grid_row, row.expense_account)
    }
})

function ClearField(grid_row){
    GetFields().forEach((val)=>{
        grid_row.grid_form.fields_dict[val].set_value(undefined)
    })
}

function MakeFieldDisable(frm, grid_row = null, expense_account=null){
    
    if(!grid_row){
        return false
    }
    
    var ledger_fields = GetFields()
    if(! expense_account){
        var expense_account = cur_frm.grid_row.get_field('expense_account').value
    }
    if(expense_account){
        frappe.call({method: "dsserp.dss_accounting.utils.get_account",args:{account: expense_account}}).then((r) => {
            if(r.message){
                ledger_fields.forEach((val)=>{
                    grid_row.grid_form.fields_dict[val].df.hidden = r.message[0][val]? false:true
                    grid_row.grid_form.fields_dict[val].refresh()
                    // grid_row.get_field(val).$input.prop('hidden', account_dict[val]? true:false);
                })
            }else{
                ledger_fields.forEach((val)=>{
                    grid_row.grid_form.fields_dict[val].df.hidden =  true
                    grid_row.grid_form.fields_dict[val].refresh()
                }) 
            }
        });
    }else{
        ledger_fields.forEach((val)=>{
            grid_row.grid_form.fields_dict[val].df.hidden =  true
            grid_row.grid_form.fields_dict[val].refresh()
        })
    }
    // frm.refresh_fields("items")
    
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