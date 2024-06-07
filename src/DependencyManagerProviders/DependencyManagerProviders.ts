import { CocoaPodsProvider } from "./CocoaPodsProvider";
import { DependencyProviderBase } from "./DependencyProviderBase";

export const dependencyManagerProviders: DependencyProviderBase[] = [
    new CocoaPodsProvider()
]