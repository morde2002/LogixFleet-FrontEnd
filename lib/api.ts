// API endpoints and tokens
// User API
const USERS_API_URL = "https://test.logixfleetapp.com/api/resource/User"
const USERS_API_TOKEN = "326ce9899dd14ad:40bdcef41b46097"

// Vehicle API endpoints
const VEHICLE_API_URL = "https://rjlogistics.logixfleetapp.com/api/resource/Vehicle"
const VEHICLE_API_TOKEN = "326ce9899dd14ad:40bdcef41b46097"

// Driver API endpoints
const DRIVER_API_URL = "https://rjlogistics.logixfleetapp.com/api/resource/Driver"
const DRIVER_API_TOKEN = "326ce9899dd14ad:40bdcef41b46097"

// Other API endpoints and tokens
const LOGIN_API_URL = "https://rjlogistics.logixfleetapp.com/api/method/login"
const LOGIN_API_TOKEN = "326ce9899dd14ad:40bdcef41b46097"

const USER_DETAILS_API_URL = "https://rjlogistics.logixfleetapp.com/api/method/erpnext.api.get_user_details"
const USER_DETAILS_API_TOKEN = "13560c2ae837ee8:47a214defca981e"

const CREATE_USER_API_URL = "https://rjlogistics.logixfleetapp.com/api/resource/User"
const CREATE_USER_API_TOKEN = "326ce9899dd14ad:40bdcef41b46097"

const ROLE_PROFILE_API_URL = "https://rjlogistics.logixfleetapp.com/api/resource/Role Profile"
const ROLE_PROFILE_API_TOKEN = "326ce9899dd14ad:40bdcef41b46097"

const DEPARTMENT_API_URL = "https://rjlogistics.logixfleetapp.com/api/resource/Department"
const DEPARTMENT_API_TOKEN = "326ce9899dd14ad:40bdcef41b46097"

// Vehicle Make and Model API endpoints
const VEHICLE_MAKE_API_URL = "https://rjlogistics.logixfleetapp.com/api/resource/Vehicle Make"
const VEHICLE_MAKE_API_TOKEN = "326ce9899dd14ad:40bdcef41b46097"

const VEHICLE_MODEL_API_URL = "https://rjlogistics.logixfleetapp.com/api/resource/Vehicle Model"
const VEHICLE_MODEL_API_TOKEN = "326ce9899dd14ad:40bdcef41b46097"

// Year API endpoint
const YEAR_API_URL = "https://rjlogistics.logixfleetapp.com/api/resource/Year"
const YEAR_API_TOKEN = "326ce9899dd14ad:40bdcef41b46097"

// Authentication API
export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch(LOGIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${LOGIN_API_TOKEN}`,
      },
      body: JSON.stringify({
        usr: email,
        pwd: password,
      }),
    })

    return await response.json()
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export async function getUserDetails(email: string) {
  try {
    const response = await fetch(`${USER_DETAILS_API_URL}?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        Authorization: `token ${USER_DETAILS_API_TOKEN}`,
      },
    })

    return await response.json()
  } catch (error) {
    console.error("Error fetching user details:", error)
    throw error
  }
}

// User API
export async function fetchUsers() {
  try {
    console.log("Fetching users from:", USERS_API_URL)
    const response = await fetch(
      `${USERS_API_URL}?fields=["name","first_name","last_name","email","full_name","enabled","role_profile","department"]`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${USERS_API_TOKEN}`,
        },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      console.error("Failed to fetch users:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Users data:", data)
    return data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export async function fetchUserById(userId: string) {
  try {
    const response = await fetch(`${USERS_API_URL}/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `token ${USERS_API_TOKEN}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user details: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching user details:", error)
    throw error
  }
}

export async function createUser(userData: any) {
  try {
    const response = await fetch(CREATE_USER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${CREATE_USER_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: userData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(userId: string, userData: any) {
  try {
    const response = await fetch(`${USERS_API_URL}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${USERS_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: userData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export async function deleteUser(userId: string) {
  try {
    const response = await fetch(`${USERS_API_URL}/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `token ${USERS_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

// Role and Department API
export async function fetchRoleProfiles() {
  try {
    const response = await fetch(ROLE_PROFILE_API_URL, {
      method: "GET",
      headers: {
        Authorization: `token ${ROLE_PROFILE_API_TOKEN}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch role profiles: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching role profiles:", error)
    throw error
  }
}

export async function fetchDepartments() {
  try {
    const response = await fetch(DEPARTMENT_API_URL, {
      method: "GET",
      headers: {
        Authorization: `token ${DEPARTMENT_API_TOKEN}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching departments:", error)
    throw error
  }
}

// Vehicle API
export async function fetchVehicles() {
  try {
    console.log("Fetching vehicles from:", VEHICLE_API_URL)
    const response = await fetch(
      `${VEHICLE_API_URL}?fields=["name","license_plate","make","model","vehicle_type","driver","year","fuel_type","color","doors","wheels","status"]`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${VEHICLE_API_TOKEN}`,
        },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      console.error("Failed to fetch vehicles:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to fetch vehicles: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Vehicles data:", data)
    return data
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    throw error
  }
}

export async function fetchVehicleById(vehicleId: string) {
  try {
    const response = await fetch(`${VEHICLE_API_URL}/${vehicleId}`, {
      method: "GET",
      headers: {
        Authorization: `token ${VEHICLE_API_TOKEN}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle details: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching vehicle details:", error)
    throw error
  }
}

export async function createVehicle(vehicleData: any) {
  try {
    const response = await fetch(VEHICLE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${VEHICLE_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: vehicleData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create vehicle: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating vehicle:", error)
    throw error
  }
}

export async function updateVehicle(vehicleId: string, vehicleData: any) {
  try {
    const response = await fetch(`${VEHICLE_API_URL}/${vehicleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${VEHICLE_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: vehicleData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update vehicle: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating vehicle:", error)
    throw error
  }
}

export async function deleteVehicle(vehicleId: string) {
  try {
    const response = await fetch(`${VEHICLE_API_URL}/${vehicleId}`, {
      method: "DELETE",
      headers: {
        Authorization: `token ${VEHICLE_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete vehicle: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    throw error
  }
}

// Vehicle Make and Model API
export async function fetchVehicleMakes() {
  try {
    const response = await fetch(VEHICLE_MAKE_API_URL, {
      method: "GET",
      headers: {
        Authorization: `token ${VEHICLE_MAKE_API_TOKEN}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle makes: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching vehicle makes:", error)
    throw error
  }
}

export async function fetchVehicleModels() {
  try {
    const response = await fetch(VEHICLE_MODEL_API_URL, {
      method: "GET",
      headers: {
        Authorization: `token ${VEHICLE_MODEL_API_TOKEN}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle models: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching vehicle models:", error)
    throw error
  }
}

// Driver API
export async function fetchDrivers() {
  try {
    console.log("Fetching drivers from:", DRIVER_API_URL)
    const response = await fetch(
      `${DRIVER_API_URL}?fields=["name","first_name","last_name","email","cell_number","country","national_id","start_date","end_date","status","vehicle"]`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${DRIVER_API_TOKEN}`,
        },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      console.error("Failed to fetch drivers:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to fetch drivers: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Drivers data:", data)
    return data
  } catch (error) {
    console.error("Error fetching drivers:", error)
    throw error
  }
}

export async function fetchDriverById(driverId: string) {
  try {
    const response = await fetch(`${DRIVER_API_URL}/${driverId}`, {
      method: "GET",
      headers: {
        Authorization: `token ${DRIVER_API_TOKEN}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch driver details: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching driver details:", error)
    throw error
  }
}

export async function createDriver(driverData: any) {
  try {
    const response = await fetch(DRIVER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${DRIVER_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: driverData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create driver: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating driver:", error)
    throw error
  }
}

// Year API
export async function fetchYears() {
  try {
    const response = await fetch(YEAR_API_URL, {
      method: "GET",
      headers: {
        Authorization: `token ${YEAR_API_TOKEN}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch years: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching years:", error)
    throw error
  }
}
