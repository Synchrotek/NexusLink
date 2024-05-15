### NexusLink
A collaborative coding web application built with React, Node.js, Express.js, Socket.io, and MongoDB. This platform enables multiple users to collaborate on coding projects in real-time, providing features such as synchronized code editing, group chat, to-do lists, notifications, and more.

<!-- ### Features
- User Authentication: Signup and login functionality for secure access.
- Room Management: Enter existing rooms or generate new roomIds for collaboration.
- Real-time Code Editor: Synchronized code editing for seamless collaboration.
- Group Chat: Communicate with other users in real-time through a group chat.
- To-do Web App: Manage and prioritize tasks with a collaborative to-do list.
- Notifications: On-screen notifications for important events. -->

## Getting Started
- Clone the repository: 
```git clone https://github.com/Synchrotek/NexusLink.git```
- Navigate to the project directory: cd NexusLink
- Install dependencies: npm install ( in the root directory )
- Set up MongoDB and configure the connection as given below.
- Create .env in NexusLink directory and add :
  ```
  VITE_ENDPOINT=[Your_backend_server_URL]
  MONGO_URI=[Your_mongodbDrivers_connection_string]
  JWT_SECRET=[Your_JWTSecretSting]
  ```
- Run the Frontend development server: npm run dev
- Run the Backend development server: npm run server:dev
  
### Tech Stack 
Backend | Frontend 
| :--- | :--- 
Node.js | React
Express.js | Socket.io-client
Socket.io | Tailwind
MongoDB | daisyUI

## Usage
- Visit the signup page and create an account.
- Log in with your credentials.
- Enter an existing room or generate a new one.
- Collaborate with other users using the real-time code editor and group chat.
- Use Todo sidebar to set personalized goals with deadlines and priorities
  
## Contribution
Explore NexusLink's capabilities and witness how it boosts collaboration. Visit the [NexusLink GitHub Repository](https://github.com/Synchrotek/NexusLink.git) to access the code and contribute. Community contributions are welcomed to enhance NexusLink, including developers, designers, testers, and documentation enthusiasts.there are many ways you can contribute:
- **Code Contributions**: Help to enhance features, fix bugs, and optimize performance by submitting pull requests with your code changes.
- **Documentation**: Improve this README, Provide better inline documentation to make it easier for others to understand and use NexusLink.
- **Testing**: Help to ensure the quality and reliability of NexusLink by testing new features, reporting bugs, and providing feedback.
- Feature Requests: Share your ideas and suggestions for new features or improvements that would make NexusLink even more useful for our users.

