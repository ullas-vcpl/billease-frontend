function Dashboard({ login, setLogin }) {
    return <>
      {!login?(window.location.href = "/login", null):(
        <div>
            <h1>Dashboard Page</h1>
        </div>
      )}
    </>
}

export default Dashboard;