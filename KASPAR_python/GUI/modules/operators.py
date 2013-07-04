
class OperatorAdmin(object):
    exposed = True
    title = "Operators"
    links = [("Add", "?operation=add"),
             ("Edit", "?operation=edit"),
             ("Delete", "?operation=delete")]
