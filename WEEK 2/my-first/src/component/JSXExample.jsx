// function JSXExample() {
//     const name = "React Developer"
//     const isLearning = true
//     const skills = ['JavaScript', 'React', 'CSS']

//     return (
//         <div> {/* Single parent element */}
//           {/* 1. Embedding JavaScript expressions */ }
//           <h1>Hello, Ner!</h1>
          
//           {/* 2. Conditional rendering */}
//           <p>{isLearning ? "Currently learning React": "React expert"}</p>
        
//         {/* 3. Using className instead of class */}
//         <div className="Skill-container">
//           <h3>Skills:</h3>
//           {/* 4. Rendering lists */}
//             <ul>
//                 {skills.map((skill, index) => (
//                     <li key={index}>{skill}</li>
//                 ))}
//             </ul>
//             </div> 

//             {/* 5. Self-closing tags */}
//             <img src="/vite.svg" alt="Vite logo" />
//             <br />
//             <hr />
//         </div>
//     )
// }

// export default JSXExample 

// function JSXExample({ name, email, role }) {
//   return (
//     <div>
//       <h1>{name}</h1>
//       <p>{email}</p>
//       <p>{role}</p>
//     </div>
//   );
// }

// export default JSXExample