from flask import Blueprint, jsonify

models = []

__menu = Blueprint('menu', __name__)
blueprints = [
              __menu,
             ]

__links = [
                {
                 'title': 'navbar.admin.label',
                 'links': [
                            ('navbar.admin.operators', 'admin.operator'),
                            ('navbar.admin.users', 'admin.user'),
                            ('navbar.admin.robots', 'admin.robot'),
                            ('navbar.admin.settings', 'admin.setting'),
                          ]},
                {
                 'title':'navbar.action.label',
                 'links': [
                            ('navbar.action.edit', 'action.edit'),
                            ('navbar.action.import', 'action.import'),
                          ]},
                {
                 'title':'navbar.game.label',
                 'links': [
                            ('navbar.game.edit', 'game.edit'),
                            ('navbar.game.import', 'game.import'),
                          ]},
                {
                 'title':'navbar.interaction.label',
                 'links': [
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
