import matplotlib.pyplot as plt
import numpy as np
from scipy.integrate import odeint #ode solver

# equations
def equation(y,t):
  theta,x = y
  f = [x,-(g/l)*np.sin(theta) - k*x]
  return f

def stepper(fun,init,time,stepSize):
  res = np.zeros((len(time),len(init)))
  res[0,:] = init
  for t in range(res.shape[0]-1):
    stepAns = fun(res[t,:],t)
    res[t+1,:]  = res[t,:] + np.array(stepSize)*stepAns
  return res

def plot_result(time,solution):
  fig = plt.figure(f"Pendulum simulation, initAng:{np.rad2deg(init[0])}")
  fig.canvas.mpl_connect('close_event', quit)
  angPlot = plt.subplot2grid((2,2),(0,0))
  plt.grid(True)
  #plt.subplot(2,1,1)
  plt.plot(time,solution[:,0])
  plt.xlabel("time (s)")
  plt.ylabel("Angle (rad)")
  curD_ang = plt.scatter(time[0],solution[0,0],color='red',linewidths=2)
  
  ang_velPlot = plt.subplot2grid((2,2),(1,0))
  plt.grid(True)
  #plt.subplot(2,1,2)
  plt.plot(time,solution[:,1])
  curD_vel = plt.scatter(time[0],solution[0,1],color='red',linewidths=2)
  plt.xlabel("time (s)")
  plt.ylabel("Angular rate (rad/s)")

  animationPlot = plt.subplot2grid((2,2),(0,1),aspect='equal',rowspan=2)
  plt.grid(True)
  
  for col in range(solution.shape[0]):
    dp = solution[col, :]    
    
    curD_ang.set_offsets([time[col],solution[col,0]])
    curD_vel.set_offsets([time[col],solution[col,1]])

    plt.Axes.clear(animationPlot)
    plt.axis([-2*l, 2*l, -2*l, 2*l])
    plt.axvline(x=0,color='green',linestyle='dashed')
    plt.axhline(y=0,color='green',linestyle='dashed')
    pnt = [l*np.cos(dp[0]),l*np.sin(dp[0])]
    plt.plot([0,pnt[1]],[0,-pnt[0]])
    plt.scatter(pnt[1],-pnt[0])
    plt.draw()
    plt.pause(0.001)

#params
g = 9.81
l = 1.0
k = 0.8
stepSize = 0.025
time = np.arange(0,15,stepSize)

#init 
init = [np.radians(45),0]

#solver
solution_ODE = odeint(equation,init,time)

solution_step = stepper(equation,init,time,stepSize)

#plot result
plot_result(time,solution_step)
plt.show()
