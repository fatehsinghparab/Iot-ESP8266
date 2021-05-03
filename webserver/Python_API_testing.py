#!/usr/bin/env python
# coding: utf-8

# In[1]:


import requests as re
import random
import time


# In[2]:


delay = int(input("Provide delay value after each request in SECONDS(int): "))
for i in reversed(range(int(input("Provide min dataset size in INT: ")))):
    re.post('http://localhost:3000/esp8266', json={"value":random.choice(range(100))})
    time.sleep(delay)


# In[ ]:




