$(document).ready(function() {
    console.log("js ready!");

    //get csrftoken
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        //these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFTOKEN", csrftoken);
            }
        }
    });

    //create reference to item being dragged
    var draggeditem = null;
    
    //store mouse coordinates
    var mouse_x = 0;
    var mouse_y = 0;

    //store top and left coordinates of element
    var draggeditem_x = 0;
    var draggeditem_y = 0;

    //store offset from mouse position to dragged item corner
    var offset_x = 0;
    var offset_y = 0;

    //update draggeditem on mouse move
    $(document).mousemove(move);
    function move(e){
        mouse_x = e.pageX
        mouse_y = e.pageY
        if(draggeditem != null){
            draggeditem.style.left = mouse_x - offset_x
            draggeditem.style.top = mouse_y - offset_y 
        }
    };

  //check if mouse cursor is in bin
  function bincheck(e){
      var binoffset = $(".recycle-bin").offset();
      var binwidth = $(".recycle-bin").width();
      var binheight = $(".recycle-bin").height();
      if (e.clientX > binoffset.left && 
          e.clientX < (binoffset.left + binwidth) &&
          e.clientY > binoffset.top &&
          e.clientY < (binoffset.top + binheight)
          ) {
              return true;
          } else {
              return false;
          };
  };

    //on mouseup, post position of draggeditem to server and clear draggeditem (or trigger deletion if in recycle bin)
    $(document).mouseup(function(e){
        if(draggeditem != null){
          var dollid = draggeditem.dataset.dollid;
		  if(bincheck(e) != false){
			var check = confirm("Are you sure you want to delete this doll? Page will reload.");
			if(check == true) {
			  $.ajax("/dollhouse/doll/"+dollid, {
			    type: 'DELETE'
			  })
            .done(function(response){
			  console.log("The request is complete!");
              console.log(response);
		    })
            .fail(function() {
               console.log("Sorry, there was a problem!");
               console.log(response);
            });
            draggeditem = null;
            window.location.reload(true);
            };
          } else { 
          var lpos = draggeditem.style.left
          var tpos = draggeditem.style.top
          //data will be set using setattr(); keys must be the model field name.
          $.ajax("/dollhouse/doll/"+dollid, {
              type: 'POST',
              data: {
                  doll_lpos: lpos,
                  doll_tpos: tpos,            
              }
          })
          .done(function(response){
              console.log("The request is complete!" );
              console.log(response);
          })
          .fail(function() {
              console.log("Sorry, there was a problem!");
          })
          draggeditem = null
        };
      };
    });

    //set draggeditem on mousedown and set offsets
    $(".dollcontainer").mousedown(function(){
        draggeditem = $(this)[0]
        console.log(draggeditem)
        offset_x = (Number(mouse_x) - Number(draggeditem.offsetLeft))
        offset_y = (Number(mouse_y) - Number(draggeditem.offsetTop))
    });

    //rename dollhouse
    $("#rename-dollhouse").click(function() {
        var dollhouseid = workingDollhouse;
        var newdollhousename = prompt("Please enter a new name for this Dollhouse. Page will reload.");
        if(newdollhousename != null){
          $.ajax("/dollhouseupdate/"+dollhouseid, {
              type: 'POST',
              data: {
                  dollhouse_name: newdollhousename,
              }
          })
          .done(function(response){
              console.log("The request is complete!");
              console.log(response);
          })
          .fail(function() {
              console.log("Sorry, there was a problem!");
          })
          window.location.reload(true);
        };
    });

    //change dollhouse background
    $("#background-select").change(function() {
        if($("#background-select").val() != null) {
            var dollhouseid = workingDollhouse;
            var dh_background = $("#background-select").val()
            console.log("changing background to " + dh_background);
            $.ajax("/dollhouseupdate/"+dollhouseid, {
                type: 'POST',
                data: {
                    dh_background_id: dh_background,
                }
            })
            .done(function(response){
               console.log("The request is complete!");
               console.log(response);
               window.location.reload(true);
           })
           .fail(function() {
               console.log("Sorry, there was a problem!");
           })
        };
    });

    //delete dollhouse
    $("#delete-dollhouse").click(function() {
        var dollhouseid = workingDollhouse;
        var check1 = confirm("Are you sure you want to delete this dollhouse?");
        var check2 = prompt("What? You really want to delete this? Then you'll have to type in 'delete'!");
        if(check1 == true && check2 == 'delete') {
           $.ajax("/dollhouseupdate/"+dollhouseid, {
               type: 'DELETE'
           })
           .done(function(response){
               console.log("The request is complete!");
               console.log(response);
               window.location.href = '/';
           })
           .fail(function() {
               console.log("Sorry, there was a problem!");
           })
        };
    });
        
});
