<%@ page contentType="text/html; charset=ISO-8859-1" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<title>Basic layout</title>
	<link rel="stylesheet" type="text/css" media="screen" href="css/layout.css"></link>
	<link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui/jquery-ui-1.8rc1.css"></link>
	
	<script type="text/javascript" src="js/jquery/jquery-1.4.1.js"></script>
  <script type="text/javascript" src="js/jquery/jquery.create.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.ui.core.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.ui.widget.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.ui.mouse.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.ui.draggable.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.ui.droppable.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.ui.tabs.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.ui.dialog.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.ui.resizable.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.ui.sortable.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.effects.core.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.effects.scale.js"></script>
  <script type="text/javascript" src="js/jquery.ui-1.8rc1/jquery.effects.slide.js"></script>
  <script type="text/javascript" src="js/common/DUI-0.0.4.js"></script>
  <script type="text/javascript" src="js/common/global.js"></script>
  <script type="text/javascript" src="js/container.js"></script>
  <script type="text/javascript" src="js/column.js"></script>
  <script type="text/javascript" src="js/item.js"></script>
  <script type="text/javascript" src="js/menu.js"></script>
  <script type="text/javascript" src="js/layout.js"></script>
  <script type="text/javascript" src="js/drawer.js"></script>
  <script type='text/javascript' src='/scrumwall/dwr/interface/ItemService.js'></script>
  <script type='text/javascript' src='/scrumwall/dwr/interface/ColumnService.js'></script>
  <script type='text/javascript' src='/scrumwall/dwr/engine.js'></script>
  <script type="text/javascript">
    $("#menu").ready(function(){
      delete Array.prototype.indexOf;
      new scrumwall.layout();
    });
  </script>
</head>
<body>
	<div id="statusIndicator">Status indicator</div>
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
	<div id="menu">
		<input type="text" value="" class="ownerInput" id="ownerInput"/><br/>
		<div class="sprintdate">
			05.05.2009 - 27.05.2009
		</div>
		<input type="button" value="UCB" id="ucbButton"/><br/>
		<input type="button" value="Goals" id="goalsButton"/><br/>
		<input type="button" value="Impediments" id="impedimentsButton"/><br/>
		<input type="button" value="Align to grid" id="alignButton"/><br/>
		<div><div class="velocity">10.5</div><div class="totalHoursLeft">34</div></div>
		<div class="burndown">burndown chart goes here</div><br/>
		<div id="itemCreator">
			<div class="sector red"></div>
			<div class="sector green"></div>
			<div class="sector blue"></div>
			<div class="sector yellow"></div>
		</div>
	</div>
	<div id="trashcanWrapper">
		<div id="trashcan"></div>
	</div>
	<div id="columnContainer"></div>
	<div id="errorHandler" title="Oops! Something went wrong" class="errorHandler" style="display:none"></div>
</body>
</html>