from flask import Blueprint, jsonify

models = []

__menu = Blueprint('menu', __name__)
blueprints = [
              __menu,
             ]

__links = [
                {
                 'title': 'Admin',
                 'links': [
                            ('Operators', 'admin.operator'),
                            ('Users', 'admin.user'),
                            ('Robots', 'admin.robot'),
                            ('Settings', 'admin.setting'),
                          ]},
                {
                 'title':'Action',
                 'links': [
                            ('Create/Edit', 'action.edit'),
                            ('Test', 'action.test'),
                            ('Import', 'action.import'),
                          ]},
                {
                 'title':'Trigger',
                 'links': [
                            ('Create/Edit', 'trigger.edit'),
                            ('Test', 'trigger.test'),
                            ('Import', 'trigger.import'),
                          ]},
                {
                 'title':'Interactions',
                 'links': [
                            ('View History', 'interaction.view'),
                            ('Begin New', 'interaction.begin'),
                            ('Manage History', 'interaction.manage'),
                          ]},
            ]


@__menu.route('/Menu', methods=['GET'])
def typesGet(type_=None):
    m = {
         'num_results': len(__links),
         'total_pages': 1,
         'page': 1,
         'objects': []
         }
    rootOrder = 1
    for item in __links:
        section = {'title': item['title'], 'order': rootOrder, 'links': []}
        rootOrder += 1
        order = 0
        for (l_title, l_path) in item['links']:
            section['links'].append(
                     {
                      'path': l_path,
                      'title': l_title,
                      'order': order
                      })
            order += 1

        m['objects'].append(section)

    return jsonify(m)
