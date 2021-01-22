<?php	
$name=$_POST['name'];
$email=$_POST['email'];
$subject=$_POST['subject'];
$message=$_POST['message'];
		
if(empty($name) || empty($email) || empty($subject) || empty($message))
{
	echo "Please fill all the fields";
}
else
{
	mail("danish.reza1@gmail.com","My Portfolio", $message, "From: $name <$email>");
	echo "<script type='text/javascript'>alert('Messeage Sent')
	window.history.log(-1);
	</script>";
			
?>
			
		
		
	
		
	
