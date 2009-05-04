<%@ page contentType="text/html; charset=ISO-8859-1" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
	<title>Basic layout</title>
	<link rel="stylesheet" type="text/css" media="screen" href="css/layout.css"/>
</head>
<body>
	<div class="item">Item 1</div>
	<div class="item">Item 2</div>
	<div id="newItemArea">
		<input type="button" id="newItem" value="New Item"/>
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
	<script type="text/javascript" src="js/layout.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			init();
		});
	</script>
</body>
</html>