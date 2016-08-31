To setup echobeach_demo:

1) Download and extract .zip file to microSD card
2) Insert microSD card into a newly flashed Intel Edison
3) Configure wifi ('configure_edison --wifi') and ssh password ('configure_edison --password')
4) navigate to '/media/sdcard/demo_setup' and run 'echobeach_setup.sh'

Now you are ready to load the demo code onto the Edison through XDK IoT edition. 
Once you have done that, restart the device or start the demo service by typing 'systemctl start node_startup.service'
