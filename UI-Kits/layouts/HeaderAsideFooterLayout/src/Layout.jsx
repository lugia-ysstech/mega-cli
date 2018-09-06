/* eslint no-undef:0, no-unused-expressions:0, array-callback-return:0 */
import React, { Component } from 'react';
import cx from 'classnames';
import Layout from '@lugai/web/layout';
import Menu, { SubMenu, Item as MenuItem } from '@lugai/web/styled-menu';
import { Link } from 'react-router';
import FoundationSymbol from 'foundation-symbol';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { asideNavs } from '../../navs';
import './scss/light.scss';

const theme = typeof THEME === 'undefined' ? 'dark' : THEME;
export default class HeaderAsideFooterResponsiveLayout extends Component {
  static propTypes = {};

  static defaultProps = {};

  // 当前打开的菜单项
  getOpenKeys = () => {
    const { routes } = this.props;
    const matched = routes[0].path;
    let openKeys = '';

    asideNavs &&
      asideNavs.length > 0 &&
      asideNavs.map((item, index) => {
        if (item.to === matched) {
          openKeys = index;
        }
      });

    return openKeys;
  };

  // 当前点击的菜单项
  handleClick = selectedKeys => {
    console.log('selectedKeys:', selectedKeys);
  };

  render() {
    const {
      location: { pathname },
      children,
    } = this.props;
    return (
      <Layout
        style={{ minHeight: '100vh' }}
        className={cx(`lugia-design-header-aside-footer-layout-${theme}`, {
          'lugia-design-layout': true,
        })}
      >
        <Header theme={theme} />

        <Layout.Section className="lugia-design-layout-body">
          <Layout.Aside
            width="auto"
            theme={theme}
            className="lugia-design-layout-aside"
          >
            <Menu
              style={{ width: 200 }}
              onClick={this.handleClick}
              selectedKeys={[pathname]}
              defaultSelectedKeys={[pathname]}
              defaultOpenKeys={[`${this.getOpenKeys()}`]}
              mode="inline"
            >
              {asideNavs &&
                asideNavs.length > 0 &&
                asideNavs.map(nav => {
                  if (nav.children && nav.children.length > 0) {
                    return (
                      <SubMenu key={nav.index}>
                        {nav.children.map(item => {
                          const linkProps = {};
                          if (item.newWindow) {
                            linkProps.href = item.to;
                            linkProps.target = '_blank';
                          } else if (item.external) {
                            linkProps.href = item.to;
                          } else {
                            linkProps.to = item.to;
                          }

                          return (
                            <MenuItem key={item.to}>
                              <Link {...linkProps}>{item.text}</Link>
                            </MenuItem>
                          );
                        })}
                      </SubMenu>
                    );
                  }

                  const linkProps = {};
                  if (nav.newWindow) {
                    linkProps.href = nav.to;
                    linkProps.target = '_blank';
                  } else if (nav.external) {
                    linkProps.href = nav.to;
                  } else {
                    linkProps.to = nav.to;
                  }

                  return (
                    <MenuItem key={nav.to}>
                      <Link {...linkProps}>
                        <span>
                          {nav.icon ? (
                            <FoundationSymbol size="small" type={nav.icon} />
                          ) : null}
                          <span className="lugia-menu-collapse-hide">
                            {nav.text}
                          </span>
                        </span>
                      </Link>
                    </MenuItem>
                  );
                })}
            </Menu>
            {/* 侧边菜单项 end */}
          </Layout.Aside>

          {/* 主体内容 */}
          <Layout.Main>{children}</Layout.Main>
        </Layout.Section>

        <Footer />
      </Layout>
    );
  }
}
