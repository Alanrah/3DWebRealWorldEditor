/**
 * @author Catherine / https://github.com/Alanrah/
 */

var MatBar = function ( editor ){


	var container = new UI.Panel();
	container.setId('matbar');

	//var preview = new MatBar.Preview(editor);
	//container.add(preview);

	//var paras = new MatBar.Paras(editor);
	//container.add(paras);

	return container;//如果忘记返回，UI.Element: Leftbar.Material {} is not an instance of UI.Element.
}