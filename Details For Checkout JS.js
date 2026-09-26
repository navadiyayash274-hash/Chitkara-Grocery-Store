function validate_form(){
    var name    = document.getElementById("name").value;
    var phone   = document.getElementById("phone").value;
    var email   = document.getElementById("email").value;
    var pincode = document.getElementById("pincode").value;
    var address = document.getElementById("address").value;
    var date    = document.getElementById("date").value;
    var time    = document.getElementById("time").value;
    var error_message = document.getElementById("error_message");

    error_message.style.padding = "10px";

    if(name.length < 3){
        error_message.innerHTML = "Please Enter a valid Name";
        return false;
    }
    if(isNaN(phone) || phone.length != 10){
        error_message.innerHTML = "Please Enter a valid Phone Number";
        return false;
    }
    if(isNaN(pincode) || pincode.length != 6){
        error_message.innerHTML = "Invalid Pincode! Please check your Pincode and fill again with exactly 6 digits.";
        return false;
    }
    if(email.indexOf("@") == -1 || email.length < 6){
        error_message.innerHTML = "Please enter a valid E-mail ID.";
        return false;
    }

    // Save checkout details to localStorage for invoice
    localStorage.setItem('cgs_name',    name);
    localStorage.setItem('cgs_phone',   phone);
    localStorage.setItem('cgs_email',   email);
    localStorage.setItem('cgs_address', address);
    localStorage.setItem('cgs_pincode', pincode);
    localStorage.setItem('cgs_date',    date);
    localStorage.setItem('cgs_time',    time);
}