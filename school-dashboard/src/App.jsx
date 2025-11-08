import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import { Layout, Menu, message, Spin, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  TableOutlined,
  AppstoreAddOutlined,
  BarChartOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import SuperAdminDashboard from "./components/SuperAdminDashboard";

const { Header, Content, Sider } = Layout;

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [menuKey, setMenuKey] = useState("1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const expiry = localStorage.getItem("token_expiry");
        if (expiry && Date.now() > Number(expiry)) {
          handleLogout();
          message.error("Session expired. Please log in again.");
        }
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, [token]);

  const normalizeRole = (role) => {
    if (!role) return "";
    return role.replace(/[^a-z]/gi, "").toLowerCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("token_expiry");
    setToken(null);
    setUserRole(null);
    message.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa"
      }}>
        <Spin size="large" />
        <p style={{ color: "#333", marginTop: 20, fontSize: 16 }}>Loading...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <Login
        onLogin={(newToken, newRole) => {
          localStorage.setItem("token", newToken);
          localStorage.setItem("role", newRole);
          localStorage.setItem("token_expiry", Date.now() + 2 * 60 * 60 * 1000);
          setToken(newToken);
          setUserRole(newRole);
          message.success("Welcome!");
        }}
      />
    );
  }

  const normalizedRole = normalizeRole(userRole);

  const allMenuItems = [
    { key: "1", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "2", label: "Students", icon: <UserOutlined />, roles: ["admin", "superadmin", "superuser"] },
    { key: "3", label: "Teachers", icon: <TeamOutlined />, roles: ["admin", "superadmin", "superuser"] },
    { key: "4", label: "Classes", icon: <AppstoreAddOutlined />, roles: ["admin", "superadmin", "teacher", "superuser"] },
    { key: "5", label: "Subjects", icon: <BookOutlined />, roles: ["admin", "superadmin", "teacher", "superuser"] },
    { key: "6", label: "Results Report", icon: <BarChartOutlined />, roles: ["admin", "superadmin", "teacher", "student", "superuser"] }
  ];

  const menuItems = allMenuItems.filter((item) => !item.roles || item.roles.includes(normalizedRole));

  const userMenuItems = [
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout }
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* SIDEBAR */}
      <Sider 
        width={260} 
        breakpoint="lg" 
        collapsedWidth="0" 
        style={{ 
          background: "#fff", 
          boxShadow: "2px 0 8px rgba(0,0,0,0.08)" 
        }}
      >
        <div style={{ 
          padding: "24px 20px", 
          textAlign: "center", 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
        }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            background: "#fff", 
            borderRadius: "50%", 
            margin: "0 auto 12px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: 24 
          }}>
            🎓
          </div>
          <h1 style={{ 
            color: "#fff", 
            fontSize: 18, 
            fontWeight: 700, 
            margin: 0 
          }}>
            {normalizedRole === "superadmin" || normalizedRole === "superuser" ? "System Portal" : "School Portal"}
          </h1>
        </div>
        <Menu 
          mode="inline" 
          selectedKeys={[menuKey]} 
          items={menuItems} 
          onClick={(e) => setMenuKey(e.key)} 
          style={{ 
            marginTop: "16px", 
            borderRight: 0,
            background: "#fff"
          }} 
        />
      </Sider>

      {/* MAIN LAYOUT */}
      <Layout style={{ background: "#f5f7fa" }}>
        {/* HEADER */}
        <Header style={{ 
          background: "#fff", 
          padding: "0 32px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)", 
          height: 72,
          position: "sticky",
          top: 0,
          zIndex: 10
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: 22, 
              color: "#1f2937", 
              fontWeight: 700 
            }}>
              {menuKey === "1" ? "Dashboard" : 
               menuKey === "2" ? "Students" : 
               menuKey === "3" ? "Teachers" : 
               menuKey === "4" ? "Classes" : 
               menuKey === "5" ? "Subjects" : "Results"}
            </h2>
            <p style={{ 
              margin: "4px 0 0", 
              fontSize: 13, 
              color: "#6b7280" 
            }}>
              {new Date().toLocaleDateString("en-US", { 
                weekday: "long", 
                month: "short", 
                day: "numeric", 
                year: "numeric" 
              })}
            </p>
          </div>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 12, 
              cursor: "pointer", 
              padding: "8px 16px", 
              borderRadius: 8 
            }}>
              <Avatar 
                style={{ 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                }} 
                icon={<UserOutlined />} 
              />
              <div>
                <div style={{ 
                  fontSize: 14, 
                  fontWeight: 600, 
                  color: "#1f2937" 
                }}>
                  {userRole || "User"}
                </div>
                <div style={{ 
                  fontSize: 12, 
                  color: "#6b7280" 
                }}>
                  {normalizedRole}
                </div>
              </div>
            </div>
          </Dropdown>
        </Header>

        {/* CONTENT AREA */}
        <Content style={{ 
          margin: "24px", 
          minHeight: "calc(100vh - 120px)" 
        }}>
          <div style={{ 
            background: "#fff", 
            borderRadius: 12, 
            padding: 32, 
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)", 
            minHeight: "100%" 
          }}>
            {/* DASHBOARD */}
            {menuKey === "1" && (
              <div>
                {normalizedRole === "superadmin" || normalizedRole === "superuser" ? (
                  <SuperAdminDashboard />
                ) : (
                  <div style={{ textAlign: "center", padding: "80px 20px" }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📊</div>
                    <h2 style={{ 
                      color: "#1f2937", 
                      fontSize: 28, 
                      fontWeight: 700, 
                      marginBottom: 12 
                    }}>
                      Admin Dashboard
                    </h2>
                    <p style={{ color: "#6b7280", fontSize: 16 }}>
                      Coming soon...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STUDENTS */}
            {menuKey === "2" && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ 
                    color: "#1f2937", 
                    fontSize: 24, 
                    fontWeight: 700, 
                    marginBottom: 8 
                  }}>
                    📚 Students
                  </h2>
                  <p style={{ color: "#6b7280", fontSize: 15 }}>
                    Manage student records
                  </p>
                </div>
                <div style={{ 
                  color: "#9ca3af", 
                  textAlign: "center", 
                  padding: "60px 20px", 
                  background: "#f9fafb", 
                  borderRadius: 8, 
                  border: "2px dashed #e5e7eb" 
                }}>
                  Student table will appear here
                </div>
              </div>
            )}

            {/* TEACHERS */}
            {menuKey === "3" && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ 
                    color: "#1f2937", 
                    fontSize: 24, 
                    fontWeight: 700, 
                    marginBottom: 8 
                  }}>
                    👨‍🏫 Teachers
                  </h2>
                  <p style={{ color: "#6b7280", fontSize: 15 }}>
                    Manage teacher profiles
                  </p>
                </div>
                <div style={{ 
                  color: "#9ca3af", 
                  textAlign: "center", 
                  padding: "60px 20px", 
                  background: "#f9fafb", 
                  borderRadius: 8, 
                  border: "2px dashed #e5e7eb" 
                }}>
                  Teacher table will appear here
                </div>
              </div>
            )}

            {/* CLASSES */}
            {menuKey === "4" && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ 
                    color: "#1f2937", 
                    fontSize: 24, 
                    fontWeight: 700, 
                    marginBottom: 8 
                  }}>
                    🏫 Classes
                  </h2>
                  <p style={{ color: "#6b7280", fontSize: 15 }}>
                    Manage class schedules
                  </p>
                </div>
                <div style={{ 
                  color: "#9ca3af", 
                  textAlign: "center", 
                  padding: "60px 20px", 
                  background: "#f9fafb", 
                  borderRadius: 8, 
                  border: "2px dashed #e5e7eb" 
                }}>
                  Class table will appear here
                </div>
              </div>
            )}

            {/* SUBJECTS */}
            {menuKey === "5" && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ 
                    color: "#1f2937", 
                    fontSize: 24, 
                    fontWeight: 700, 
                    marginBottom: 8 
                  }}>
                    📖 Subjects
                  </h2>
                  <p style={{ color: "#6b7280", fontSize: 15 }}>
                    Manage curriculum
                  </p>
                </div>
                <div style={{ 
                  color: "#9ca3af", 
                  textAlign: "center", 
                  padding: "60px 20px", 
                  background: "#f9fafb", 
                  borderRadius: 8, 
                  border: "2px dashed #e5e7eb" 
                }}>
                  Subject table will appear here
                </div>
              </div>
            )}

            {/* RESULTS */}
            {menuKey === "6" && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ 
                    color: "#1f2937", 
                    fontSize: 24, 
                    fontWeight: 700, 
                    marginBottom: 8 
                  }}>
                    📊 Results Report
                  </h2>
                  <p style={{ color: "#6b7280", fontSize: 15 }}>
                    View academic reports
                  </p>
                </div>
                <div style={{ 
                  color: "#9ca3af", 
                  textAlign: "center", 
                  padding: "60px 20px", 
                  background: "#f9fafb", 
                  borderRadius: 8, 
                  border: "2px dashed #e5e7eb" 
                }}>
                  Results will appear here
                </div>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
