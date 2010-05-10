package com.scrumwall.gwt;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import com.google.gwt.user.client.rpc.RemoteService;

@Component("rpcServiceLocator")
public class BeanScanningRpcFacadeLocator implements BeanPostProcessor,
    RpcFacadeLocator, ApplicationContextAware {

  private static final Log LOG = LogFactory.getLog(BeanScanningRpcFacadeLocator.class);

  private final Map<Class<?>, String> rpcHandlers = new HashMap<Class<?>, String>();

  private ApplicationContext applicationContext;

  public Object postProcessAfterInitialization(final Object bean,
      final String beanName) {
    return bean;
  }

  public Object postProcessBeforeInitialization(final Object bean,
      final String beanName) {

    final Class<?> beanClass = getTargetClass(bean);
    if (isEligibleForMapping(beanClass)) {
      LOG.info("Registering RPC handlers");

      LOG.info("Registering bean with name \"" + beanName + "\" (" + beanClass
          + ") for handling incoming RPCs");

      final Class<?> mappableInterface = getMappableInterface(beanClass);

      if (rpcHandlers.containsKey(mappableInterface)) {
        final IllegalStateException e = new IllegalStateException("Multiple RPC handlers of type \"" + 
        		mappableInterface.getName() + "\" found");
        LOG.error(e);
        throw e;
      }
      rpcHandlers.put(mappableInterface, beanName);
    }
    return bean;
  }

  private Class<?> getTargetClass(final Object bean) {
    return AopUtils.getTargetClass(bean);
  }

  /**
   * Searches the interfaces implemented by the target class for the one
   * extending the {@link RemoteService} interface.
   *
   * @param beanClass
   *          the class to examine
   * @return the interface extending the {@link RemoteService} interface, which
   *         is implemented by the beanClass
   */
  private Class<?> getMappableInterface(final Class<?> beanClass) {

    final Class<?>[] interfaces = beanClass.getInterfaces();

    final List<Class<?>> mappableInterfaces = new ArrayList<Class<?>>();

    for (final Class<?> iface : interfaces) {
      if (RemoteService.class.isAssignableFrom(iface)) {
        mappableInterfaces.add(iface);
      }
    }

    final int size = mappableInterfaces.size();

    if (size == 1) {
      return mappableInterfaces.get(0);
    }

    IllegalStateException e;

    if (mappableInterfaces.isEmpty()) {
      e = new IllegalStateException("GWT RPC handler does not implement "
          + "the \"" + RemoteService.class.getName() + "\" interface");
    } else {
      e = new IllegalStateException("GWT RPC handler implements more than one \""
              + RemoteService.class.getName() + "\" interface");
    }

    LOG.error(e);
    throw e;
  }

  /**
   * Determines if the given class is eligible to be mapped as an RPC handler
   *
   * @param beanClass
   *          the target class to examine
   * @return <tt>true</tt>, if beanClass is annotated with {@link RpcFacade},
   *         <tt>false</tt> otherwise
   */
  private boolean isEligibleForMapping(final Class<?> beanClass) {
    return beanClass.isAnnotationPresent(RpcFacade.class);
  }

  public Object getRpcHandler(final Class<?> type) {
    return applicationContext.getBean(rpcHandlers.get(type));
  }

  public int getRpcHandlerCount() {
    return rpcHandlers.size();
  }

  public void setApplicationContext(final ApplicationContext applicationContext) {
    this.applicationContext = applicationContext;
  }

}
