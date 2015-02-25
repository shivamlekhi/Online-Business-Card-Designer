$(document).ready(function() {
	UI();
});

var GetVars = getUrlVars(window.location.search);

function UI () {
	ToggleGrid();
	CardUI();
	MenuBarUI();
	// AddToCard("Title");
	AddToCard("image");
	BoxEdit();
}

function ToggleGrid() {
	/*$(".grid_overlay").toggle();

	$("#ToggleGrid").click(function() {
		$(".grid_overlay").toggle();
	});*/

$('.element_checkbox').change(function(){
	var back = $(this).parent().css("background");
	console.log($(this).attr("element"));
	if(this.checked) {
		AddToCard($(this).attr("element"));
		$(this).parent().css("background", "#1ABC9C");
	}
	else {
		RemoveFromCard($(this).attr("element"));
		$(this).parent().css("background", "'" + back + "'");
	}
});
}

function BoxEdit() {
	var focusedElement;
	$("#ImageUrlInput").change(function() {
		focusedElement = $("#EditOptions").attr("focused-element");
		//$("#logo").attr("url", $("#ImageUrlInput").val());		
		console.log(focusedElement);

		$(focusedElement).css({
			background: "url( '" + $("#ImageUrlInput").val() + "') no-repeat",
			"background-size": "contain"
			// border: "none"
		});
	});
}

function MenuBarUI() {
	//For Card Orientation
	$("#FlipCardButton").click(function() {
		$("#CardSpace").css({height: "500px", width: "300px", top: "15%", left: "35%"});
	});

	// For Adding Element
	$("#FlipMenuButton").click(function() {
		$("#MenuFront").css({
			"-webkit-transform": "rotateX(180deg)"
		});

		// $("#MenuFront").toggle();
		$("#MenuBack").css({"-webkit-transform": "rotateX(0deg)", "z-index": 1000, "display":"block"});
		$("#MenuFront").css("z-index", 0);

		// Disappear After Flipping Menu
		setTimeout(function() {$("#MenuFront").css("display", "none");}, 500);
	});

	$("#FlipCardBackButton").click(function() {
		$("#MenuBack").css({
			"-webkit-transform": "rotateX(180deg)", 
		});

		// $("#MenuBack").toggle();
		$("#MenuFront").css({"-webkit-transform": "rotateX(0deg)", "z-index": 1000});
		
		// Disappear After Flipping Menu
		setTimeout(function() {
			$("#MenuBack").css("z-index", 0);
			$("#MenuBack").css("display", "none");
			$("#MenuFront").css("display", "block");
		}, 500);

		AddToCard($("#NewElementSelect").val());
	});
}

function CardUI() {
	MakeElementDraggable();
	ElementContextMenu();
	ResizeElement();
}

function ResizeElement() {
	
	var elementId;
	$("#ContextResizeElement").click(function(){
		$("#ResizeHandle").show();
		elementId = "#" + $(this).attr("focused");

		console.log($(elementId).offset().top);
		$("#ResizeHandle").css({
			"top": ($(elementId).offset().top + $(elementId).height() - 5),
			"left": ($(elementId).offset().left + $(elementId).width() - 5)
		});		

		$(elementId).css("border", "1px solid #2e2e2e");
	});

		$("#ResizeHandle").mousedown(function(e) {

				// Subtracting The Offset Of CardSpace Then Centering The Mouse By Height / 2
				$("#CardSpace").mousemove(function(e) {
					$(elementId).css({
						"height": ((e.pageY - $(elementId).offset().top)),
						"width": ((e.pageX - $(elementId).offset().left))
					});

					$("#ResizeHandle").css({
							"top": e.pageY - 5,
							"left": e.pageX - 5
					});	
				});
		});

		$("#ResizeHandle").mouseup(function() {
			$("#CardSpace").unbind("mousemove");
			// $(elementId).css("border", "none");
		});
	
}

function ElementContextMenu() {
		// Selecting The Element For Editing 
		var selected = false;
		$("#ContextEditElement").click(function(e) {
			var elementId = "#" + $(this).attr("focused");
			$("#EditOptions").attr("focused-element", elementId);

			if($("#EditOptions").css("display") == "none") {
				$("#EditOptions").css("display", "block");
				InitEdit();
			} else {		
				InitEdit();
			}



		if(elementId.substring(0,6) == "#image" || elementId == "#CardSpace") {
			$("#TextEditOptions").css("display", "none");
			$("#ImageEditOptions").css("display", "block");
//			console.log("Logo");
		} else {
			$("#TextEditOptions").css("display", "block");
			$("#ImageEditOptions").css("display", "none");
//			console.log("Text");
		}
	});

		$("#ContextDeleteElement").click(function(){
			var elementId = $(this).attr("focused");
			RemoveFromCard(elementId);			
		});

		$(document).bind("contextmenu", function(event){
			console.log(event.toElement.className);
			if(event.toElement.className.substring(0,7) == 'element' || event.toElement.id == "CardSpace"){
				event.preventDefault();

				$("#ElementContextMenu").css({
					"top":  event.pageY,
					"left": event.pageX
				});

				$(".ContextOptions").attr("focused", event.toElement.id);

				$("#ElementContextMenu").toggle();
			}
		});

	//Hiding Context Menu on Click on Body
	$(document).bind("click", function(event) {
		$("#ElementContextMenu").hide();
	});
}

function MakeElementDraggable() {
	// Dragging The Element		
	$("#CardSpace").on('mousedown' , ".element", function(e) {

		// Filtering Left Click Only
		if(e.which == 1) {
			var elementId = "#" + $(this).attr("id");
			
			$(elementId).css("border", "1px solid #3498DB");

				// Subtracting The Offset Of CardSpace Then Centering The Mouse By Height / 2
				$("#CardSpace").mousemove(function(e) {
					// if(e.pageX > $(this).offset().left) {
						$(elementId).css({
							"top": (e.pageY - ($(this).offset().top + $(elementId).height() / 2)),
							"left": (e.pageX - ($(this).offset().left + $(elementId).width() / 2))
							});

					// }
						$("#ResizeHandle").css({
							"top": ($(elementId).offset().top + $(elementId).height() - 5),
							"left": ($(elementId).offset().left + $(elementId).width() - 5)
						});	
				});

			}
		});

	// Dropping The Element
	$("#CardSpace").on('mouseup' , ".element", function(e) {
		$("#CardSpace").unbind("mousemove");
		$("#" + $(this).attr("id")).css("border", "none");
	});
}


function InitEdit() {
	var focusedElement = $("#EditOptions").attr("focused-element");

	// Giving Existing Properties
	$("#EditTextInput").val($(focusedElement).html());	
	$("#FontFamilySelect").val($(focusedElement).css("font-family"));
	$("#FontSizeSelect").val("22");

	console.log($(focusedElement).css("font-size"));

	// ------- PENDING -------// 
	//$("#FontColorSelect").val($(focusedElement).css("color"));
	//console.log($(focusedElement).css("color"));

	//Listening For Select Value Changes
	$(".EditSelect").change(function() {
		focusedElement = $("#EditOptions").attr("focused-element");		
		console.log(focusedElement + " has changed");
		switch($(this)[0].id) {
			case "FontSizeSelect":
			$(focusedElement).css("font-size", $(this).val());
			break;
			case "FontFamilySelect":
			$(focusedElement).css("font-family", $(this).val());
			break;
			case "FontColorSelect":
			$(focusedElement).css("color", $(this).val());
			break;
		}
	});

	$("#EditTextInput").change(function() {
		console.log(focusedElement + "  " + $(this).val())
		focusedElement = $("#EditOptions").attr("focused-element");		
		
		$(focusedElement).html($(this).val());
	});

}

var text_components = [];
var div_components = [];
var Image_components = [];
function AddToCard(component) {

	switch(component){
		case "text":
			text_components.push("text-element-" + text_components.length);
			$("#CardSpace").append("<span id= text-element-" + text_components.length + " class='element'>Right Click To Edit</span>");			break;
		case "image":
			Image_components.push("image-element-" + Image_components.length);
			$("#CardSpace").append("<div id= image-element-" + Image_components.length + " class='element element-image'></div>");
			break;
		case "division":
			div_components.push("box-element-" + div_components.length);		
			$("#CardSpace").append("<div id= box-element-" + div_components.length + " class='element element-div'></div>");
			break;
	}

	/*if(component == "logo") {
		$("#CardSpace").append("<img id=" + component + " class='element element-image' url='' />");
	}
	else {
		var string = GetVars[component].replace("+", "&nbsp");
		$("#CardSpace").append("<span id=" + component + " class='element'>" + string + "</span>");
	}*/
}

function RemoveFromCard(component) {
	// Removing id set as Title
	var selector = "#" + component;
	$("#CardSpace").find(selector).remove();
}

function getUrlVars(url) {
	var vars = {};
	var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}