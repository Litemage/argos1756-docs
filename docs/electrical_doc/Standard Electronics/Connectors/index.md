---
sidebar_position: 3
---
import PowerPolesImage from './PowerPoles.jpg'
import FerrulesImage from './ferrules.jpg'
import RingTerminalsImage from './Ring_Terminals.jpg'
import MolexSLImage from './molex sl connectors.png'
import WagoConnectorImage from './Wago_Connector.jpg'
import PushConnectorImage from './PWF_can_push.jpg'

# Connectors Overview

## Overview

Proper connectors are essential for reliable electrical connections on FRC robots. Different types of connectors are used for different applications, from high-current power connections to low-current signal connections.

:::important
Whenever connecting wires, make sure to do the pull test to assure the wires are properly connected.
:::

---

## Connector Selection Guidelines

**Power Connections (High Current):**
- Use Anderson Powerpoles for removable connections
- Use ring terminals for permanent bolt connections
- Always match connector rating to circuit requirements

**Signal Connections (Low Current):**
- Use Molex SL connectors for removable signal connections
- Use ferrules for screw and push terminal connections

---
## Connector Quick Reference 
### Anderson Powerpoles

Anderson Powerpoles are the standard connector for power distribution in FRC robots. They provide reliable, high-current connections that can be easily assembled and disassembled.

<img src={PowerPolesImage} width="400"/>

**Anderson Powerpoles Crimping Tutorial**
<iframe width="560" height="315" src="https://www.youtube.com/embed/31L5NHjmtqo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

**Applications:**
- Power Wires
- CAN Wires 

---

### Ferrules

Ferrules are small metal sleeves that are crimped onto the end of stranded wire to provide a solid, reliable connection point for screw and push terminals.
<img src={FerrulesImage} width="400"/>

**Ferrules Crimping Tutorial:** 
<iframe width="560" height="315" src="https://www.youtube.com/embed/2xw_8bHx_SI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

**Applications:**
- Any push connector

---

### Ring Terminals

Ring terminals provide secure connections to bolts, screws, and studs. They are commonly used for ground connections and battery terminals.

<img src={RingTerminalsImage} width="400"/>

**Applications:**
- Battery terminal connections
- Kraken wiring

---

### Molex SL Connectors

Molex SL connectors are commonly used for CAN bus connections and other low-current signal applications. They provide reliable, removable connections for communication and sensor wires.

<img src={MolexSLImage} width="400"/>

**Molex SL Crimping Tutorial**
<iframe width="560" height="315" src="https://www.youtube.com/embed/khB2-0bkj9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

**Applications:**
- CAN bus connections between devices
- Sensor signal connections
- Low-current control connections

---

### WAGO Connectors

WAGO connectors are lever-actuated wire connectors that provide secure, toolless connections for electrical wiring. 

<img src={WagoConnectorImage} width="400"/>

**WAGO Connector Tutorial**
<iframe width="560" height="315" src="https://www.youtube.com/embed/d6VeZthlA8k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

**Applications:**
- Quick wire splicing

---

### Push Connectors

Push connectors (also known as push-in or spring-loaded connectors) are toolless connectors that allow wires to be inserted directly into the terminal without screws or levers. They are commonly found on various electrical devices and provide quick, secure connections.

:::note
When using push connectors with stranded wire, always use [ferrules](#ferrules) to ensure a reliable connection and prevent wire strands from spreading.
:::

<img src={PushConnectorImage} width="400"/>

**CAN Push Connector Tutorial**
<iframe width="560" height="315" src="https://www.youtube.com/embed/w1q2TVaoWgU?start=54" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


---




