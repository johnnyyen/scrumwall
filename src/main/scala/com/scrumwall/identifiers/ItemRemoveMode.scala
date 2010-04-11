package com.scrumwall.identifiers

case object MOVE_LEFT extends ItemRemoveMode(1)
case object MOVE_RIGHT extends ItemRemoveMode(2)
case object REMOVE extends ItemRemoveMode(3)
case object NO_ITEMS extends ItemRemoveMode(4)

sealed case class ItemRemoveMode(val id: Int) {
  def apply(id: Int) = id match {
    case 1 => MOVE_LEFT
    case 2 => MOVE_RIGHT
    case 3 => REMOVE
    case 4 => NO_ITEMS
    case _ => throw new IllegalArgumentException("Invalid id for ItemRemoveMode: " + id)
  }
  
  def direction: String = id match {
    case 1 => "left"
    case 2 => "right"
    case _ => "no direction"
  }
  
}
