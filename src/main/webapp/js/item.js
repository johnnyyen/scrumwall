
scrumwall.create("item", {
	
	init:function(parentEl,id){
		var pos = $(parentEl).offset();
		
		this.el = jQuery.create("div",{"class":"item"});	
		this.el.guid = "i"+id;
		
		$(this.el).css({left:pos.left + "px",top:pos.top+ "px"});
		$(this.el).draggable();
		$(this.el).text("I am a new item. Drag me");
		$("#menu").append($(this.el));
		$(this.el).show();
	},
	save:function(){
		
	}
	
});