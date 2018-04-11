function Set() {
	var js_news='hidden';
	for (i in document.cookie.split('; '))
	{
		if (document.cookie.split('; ')[i].split('=')[0] == "NEW_1")
		{
			js_news = document.cookie.split('; ')[i].split('=')[1];
		}
	}

	if (js_news == "show")
	{
		document.getElementById("js_news").style.display = 'block';
	}   
	else
	{
		document.getElementById("js_news").style.display = 'none';
	}

}

function Show(element) {
	if (document.getElementById(element).style.display == 'none')    
	{
		document.getElementById(element).style.display = 'block';       
		if (element == "js_news")
		{
			document.cookie = "NEW_1=show";
		}
	}
	else
	{
		document.getElementById(element).style.display = 'none';
		if (element == "js_news")
		{
			document.cookie = "NEW_1=hidden";
		}
	}
}