

def from_object_to_json(data, object_type):
    object_list = []

    for object in data:
        object_attr = {}
        object_attr['id'] = object.id

        if object_type == 'comment':
            object_attr['text'] = object.text
        if object_type != 'comment':
            object_attr['name'] = object.name
        if object_type == 'board' and object.bg_color:
            object_attr['bg_color'] = object.bg_color
        if object_type == 'card' and object.column:
            object_attr['column'] = object.column_id

        object_list.append(object_attr)

    return object_list
