export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const Sidebar = styled.nav`
  width: 200px;
  background-color: #ff7f32;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  height: 100vh;
`;

export const SidebarBrand = styled.h1`
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
  cursor: pointer;
`;

export const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const SidebarLink = styled.button`
  background: transparent;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s ease;
  width: 100%;
  text-align: left;

  &:hover {
    background-color: #e67e22;
    border-radius: 5px;
  }
`;

export const SidebarSeparator = styled.hr`
  margin: 30px 0;
  border: 1px solid #fff;
`;

export const Content = styled.main`
  flex-grow: 1;
  padding: 30px;
  flex-direction: column;
  display: flex;
  justify-content: flex-start;
`;

export const DashboardTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
`;

export const InfoBox = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;

  h3 {
    font-size: 20px;
    margin-bottom: 15px;
  }

  p {
    font-size: 16px;
  }
`;

export const Footer = styled.footer`
  background-color: #ff7f32;
  padding: 10px;
  text-align: center;
  color: white;
  margin-top: auto;
  font-size: 14px;
`;


