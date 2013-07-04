
class Users(object):
    exposed = False
    title = "Users"
    links = [("Add", "?operation=add"),
             ("Edit", "?operation=edit"),
             ("Delete", "?operation=delete")]
