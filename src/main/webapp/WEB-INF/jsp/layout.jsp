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
		<input type="text" value="Your name"/><br/>
		<div class="sprintdate">
			05.05.2009 - 27.05.2009
		</div>
		<input type="button" id="newItem" value="New Item"/><br/>
		<input type="button" value="UCB"/><br/>
		<input type="button" value="Goals"/><br/>
		<input type="button" value="Impediments"/><br/>
		<input type="button" value="Options"/><br/><br/>
		<div class="burndown">burndown chart goes here</div><br/>
		<div class="item">Item 1</div>
		
	</div>
	<div id="tabbar">
		<ul>
			<li>
				<a href="#areaContainer">Sprint 1</a>
			</li>
			<li>
				<a href="#areaContainer">Sprint 2</a>
			</li>
			<li>
				<a href="#areaContainer">Sprint 3</a>
			</li>
			<li>
				<a href="#areaContainer">Sprint 4</a>
			</li>
			<li>
				<a href="#areaContainer">New sprint</a>
			</li>
		</ul>
	</div>
	<div class="areaContainer">
		<div id="left">left</div>
		<div class="centerContainer">
			<div class="centerleft">centerleft</div>
			<div class="centerright">centerright</div>
		</div>
		<div id="right">right</div>
	</div>
	<script type="text/javascript" src="js/jquery-1.3.2/jquery-1.3.2.js"></script>
	<script type="text/javascript" src="js/jquery-1.3.2/ui.core.js"></script>
	<script type="text/javascript" src="js/jquery-1.3.2/ui.draggable.js"></script>
	<script type="text/javascript" src="js/jquery-1.3.2/ui.tabs.js"></script>
	<script type="text/javascript" src="js/layout.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			init();
		});
	</script>
</body>
</html>