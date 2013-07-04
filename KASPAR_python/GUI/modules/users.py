
class OperatorAdmin(object):
    exposed = True
    title = "Users"
    links = [("Add", "?operation=add"),
             ("Edit", "?operation=edit"),
             ("Delete", "?operation=delete")]
