
class OperatorAdmin(object):
    exposed = False
    title = "Operators"
    links = [("Add", "?operation=add"),
             ("Edit", "?operation=edit"),
             ("Delete", "?operation=delete")]

    def GET(self, operation):
        if operation == "add":
            pass
        elif operation == "edit":
            pass
        elif operation == "delete":
            pass
        