# SimplePendulum
The idea and goal of this project is to reassure myself that I know how to derive system equations, and how mechanical system are simulated. From [Chalmers university](www.chalmers.se) we mostly used Matlab for simulations in almost all courses. Since Matlab makes matrice math ridiculous simple, I was left a bit uncertain with my abilities to acctually implement similar simulations on my own in other languages. Therefore, this repo was created.


The simple pendulum uses the [Euler forward](https://en.wikipedia.org/wiki/Euler_method) method for force integration, a very crude method. For simple projects it suffies but the [runge kutta](https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods) scheme would be prefered.


This repo contains the simple pendulum simulation, implemented in three different instances.
- A pythonscript
- A very simple webpage
- A more nice looking webpage, with explanations on how it all works
<hr>
### [The python script](https://github.com/Demiz1/SimplePendulum/blob/main/PendulumSimulation.py)
Uses numpy, math and matplotlib library.
Plots the angle of the pendulum, its angular rate together with a nice visualizeation of the pendulum state.

![image](https://user-images.githubusercontent.com/38656281/158705258-61eec079-da3e-4e05-a842-64e4db7e379c.png)

### [The simple webpage](https://github.com/Demiz1/SimplePendulum/tree/main/simpleWebpagePendulum)
The simple webpage does pretty much the same as the python script, but in webpage format, all client sided.

Graphing is done with [Plotly](https://plotly.com/javascript/). 
Matrice multiplication was done with [math.js](https://github.com/josdejong/mathjs).

![image](https://user-images.githubusercontent.com/38656281/158705033-0e1cb494-773c-41b3-84e1-fa14051fa9fc.png)


### [The nice looking webpage](https://github.com/Demiz1/SimplePendulum/tree/main/WebpagePendulum)
This is a nicer webpage, based on a bootstrap template (just dont open on mobile😅). I wanted a nice way to wrap up the project. The webpage contains the same technical functionallity as the simple webpage, but the parameters can be changed and updated. This webpage also contains explanations on how the simulation works and how the model is derrived.

![image](https://user-images.githubusercontent.com/38656281/158707701-c92348be-2a5e-42e5-940f-390f313de3f2.png)
