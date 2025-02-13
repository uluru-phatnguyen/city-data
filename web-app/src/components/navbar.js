const Navbar = () => {
    return (
      <div className="w-full bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">My App</div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="rounded p-2 text-black"
          />
        </div>
      </div>
    );
  };
  
  export default Navbar;