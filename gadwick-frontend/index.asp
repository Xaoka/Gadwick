<%EnableSessionState=False
host = Request.ServerVariables("HTTP_HOST")

if host = "gadwick.co.uk" or host = "www.gadwick.co.uk" then
response.redirect("https://www.gadick.co.uk/")

else
response.redirect("https://www.gadick.co.uk/")

end if
%>