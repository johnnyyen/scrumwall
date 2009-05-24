<%@ page contentType="text/html; charset=ISO-8859-1" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
	<title>Basic layout</title>
	<link rel="stylesheet" type="text/css" media="screen" href="css/layout.css"/>
	<link rel="stylesheet" type="text/css" media="screen" href="css/jquery-1.3.2/jquery-ui.css"/>
</head>
<body>
	<div id="menu">
		<input type="text" value="Your name" class="ownerInput" id="ownerInput"/><br/>
		<div class="sprintdate">
			05.05.2009 - 27.05.2009
		</div>
		<input type="button" id="newItem" value="New Item"/><br/>
		<input type="button" value="UCB"/><br/>
		<input type="button" value="Goals"/><br/>
		<input type="button" value="Impediments"/><br/>
		<input type="button" value="Options"/><br/><br/>
		<div class="burndown">burndown chart goes here</div><br/>
		<div id="itemCreator">Click me to create items</div>
		
	</div>
	<div id="tabbar">
		<ul>
			<li>
				<a href="#columnContainer">Sprint 1</a>
			</li>
			<li>
				<a href="#columnContainer">Sprint 2</a>
			</li>
			<li>
				<a href="#columnContainer">Sprint 3</a>
			</li>
			<li>
				<a href="#columnContainer">Sprint 4</a>
			</li>
			<li>
				<a href="#columnContainer">New sprint</a>
			</li>
		</ul>
	</div>
	<div id="columnContainer"></div>
	<script type="text/javascript" src="js/jquery-1.3.2/jquery-1.3.2.js"></script>
	<script type="text/javascript" src="js/jquery.ui-1.7.1/ui.core.js"></script>
	<script type="text/javascript" src="js/jquery.ui-1.7.1/ui.draggable.js"></script>
	<script type="text/javascript" src="js/jquery.ui-1.7.1/ui.droppable.js"></script>
	<script type="text/javascript" src="js/jquery.ui-1.7.1/ui.tabs.js"></script>
	<script type="text/javascript" src="js/jquery-1.3.2/jquery.create.js"></script>
	<script type="text/javascript" src="js/common/DUI-0.0.4.js"></script>
	<script type="text/javascript" src="js/common/global.js"></script>
	<script type="text/javascript" src="js/column.js"></script>
	<script type="text/javascript" src="js/item.js"></script>
	<script type="text/javascript" src="js/menu.js"></script>
	<script type="text/javascript" src="js/layout.js"></script>
	<script type="text/javascript">
		var config = {
			columns:7
		};
		$(document).ready(function(){
			new scrumwall.layout(config);
		});
	</script>
</body>
</html>