$(document).ready(function() {
    console.log("js ready!");

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


//    function updateposition(f){
//        var mouse_x = f.pageX
//        var mouse_y = f.pageY
//       console.log(mouse_x)
//        console.log(mouse_y)
//    }

    $(document).mousemove(move);


    function move(e){
        mouse_x = e.pageX
        mouse_y = e.pageY
        //console.log("The one that got away!")
        //$(this).css('opacity',0)
        if(draggeditem != null){
            console.log(draggeditem)
            console.log("left " + draggeditem.style.left)
            draggeditem.style.left = e.pageX - offset_x
            console.log("left " + draggeditem.style.left)
            console.log("top " + draggeditem.style.top)
            draggeditem.style.top = e.pageY - offset_y 
            console.log("top " + draggeditem.style.top)
        }
    };

    $(document).mouseup(function(){
        draggeditem = null
    });

    $(".doll").mousedown(function(){
        draggeditem = $(this).find("img").get(0)
        console.log(draggeditem)
        console.log("mouse x = " + mouse_x)
        console.log("mouse y = " + mouse_y)
        console.log("offset left = " + draggeditem.offsetLeft)
        console.log("offset top = " + draggeditem.offsetTop)
        offset_x = (Number(mouse_x) - Number(draggeditem.offsetLeft))
        offset_y = (Number(mouse_y) - Number(draggeditem.offsetTop))
        console.log("offset_x = " + offset_x)
        console.log("offset_y = " + offset_y)
        //console.log("...or is she?")
        //$(this).css('opacity',1)
    });

    $(document).click(function(){
       console.log(draggeditem)
       console.log(mouse_x)
    });
    
    function drag(){
        console.log("It works!")
    }
    
})