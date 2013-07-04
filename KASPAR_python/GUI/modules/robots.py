
class OperatorAdmin(object):
    exposed = True
    title = "Robots"
    links = [("Add", "?operation=add"),
             ("Edit", "?operation=edit"),
             ("Delete", "?operation=delete")]
