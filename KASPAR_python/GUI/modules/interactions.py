
class OperatorAdmin(object):
    exposed = True
    title = "Interactions"
    links = [("Add", "?operation=add"),
             ("Edit", "?operation=edit"),
             ("Delete", "?operation=delete")]
