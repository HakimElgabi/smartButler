from guizero import App, Text, PushButton, TextBox
app = App(title="Hello world")

welcome_message = Text(app, text="Smart Butler", size=20, color="green")

my_name= TextBox(app)

def forward():
    welcome_message.value = my_name.value


PushButton(app,command=forward, text ="Butler FORWARD")

app.display()
