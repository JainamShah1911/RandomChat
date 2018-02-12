# RandomChat

An application, Chat Random, which allows two random users to chat with each other via text from their browser. When a user visits the webpage, if there are no other users available, let them know they're in line to talk to the very next person who joins the site. Otherwise, pair them up and let them chat! No need for accounts, a user can use a nickname of their choosing when they load the webpage and doesn't need to be remembered between visits.

Furthermore implemeneted a couple basic commands - similar to the slash commands know from IRC.

• If a user types /delay 1000 hello, then the message hello should be relayed to their chat partner with a delay of 1000 ms.
• If a user types /hop then attempt to repair with another user or wait until another is available.

# How to run

step 1 : clone this repo

step 2 : run npm i
```
npm i
```

step 3 : run node server.js
```
node server.js
```

step 4 : open localhost:3000 
