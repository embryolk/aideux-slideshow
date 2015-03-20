var Contact = function(form){
	form = $(form);
	
	$(form).find("input,textarea").
		focus(function(ev){ 
			var $this = $(this);
			if( $this.val() === $this.attr("data-default")){
				$this.val(""); 
			}
		}).
		blur(function(ev){
			var $this = $(this);
			if( $this.val().trim().length === 0){
				$this.val($this.attr("data-default"));
			} 
		});
                        
	
	var checkField = function(fieldName){
		var field = form.find("#"+fieldName);
		var fieldValue = field ? field.val() : '';
		if( field.length === 0 || fieldValue.length === 0 || fieldValue === field.attr("data-default") ){
			if( Contact.VOWELS.indexOf(fieldName.charAt(0)) !== -1 ){
				throw "Please Supply an "+fieldName;
			} else {
				throw "Please Supply a "+fieldName;
			}
		} else if( fieldName === 'email' && (fieldValue.indexOf('@') === -1 || fieldValue.indexOf('.') === -1) ) {
			throw "Please Supply a valid email address";
		} else {
			return fieldValue;
		}
	};
	
	
	var send = function(event){
		event.preventDefault();
		
		var name, email, message;
		try{
			name = checkField("name");
			email = checkField("email");
			message = checkField("message");
		} catch (error) {
			alert(error);
			return;
		}
		
		var mailObject = {
			"key": Contact.SEND_KEY,
			"message": {
				"text": message,
				"subject": "Contact Message",
				"from_email": "customer@aideux.com",
				"from_name": name,
				"to": [
					{
						"email": "info@aideux.com",
						"name": "Aideux Info",
						"type": "to"
					}
				],
				"headers": {
					"Reply-To": email
				}
			},
			"async": false
		};
		
		$(this).html("SENDING...");
		$.post(Contact.SEND_URL, mailObject, function(data){
			window.location.href = Contact.SUCCESS_PAGE;
		});
	};
	
	$("#submit").click(send);
};

Contact.SEND_URL = "https://mandrillapp.com/api/1.0/messages/send.json";
Contact.SEND_KEY = "Abq768P6xLeL57eDOERVRw";
Contact.SUCCESS_PAGE = "success.html";
Contact.VOWELS = ["a","e","i","o","u","A","E","I","O","U"];

